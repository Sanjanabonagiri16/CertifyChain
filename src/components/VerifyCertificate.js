import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNotification } from '../context/NotificationContext';
import jsQR from 'jsqr';

function VerifyCertificate() {
  const { success, error } = useNotification();
  const [certificateId, setCertificateId] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const verifyCertificate = async (id) => {
    // Get certificates from localStorage
    const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    const foundCertificate = certificates.find(cert => cert.id === id);
    
    if (!foundCertificate) {
      throw new Error('Certificate not found');
    }

    // Check if certificate is expired
    const isExpired = foundCertificate.expiryDate && new Date(foundCertificate.expiryDate) <= new Date();
    
    return {
      ...foundCertificate,
      isValid: !isExpired
    };
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (!certificateId.trim()) {
      error('Please enter a certificate ID');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyCertificate(certificateId);
      setCertificate(result);
      if (result.isValid) {
        success('Certificate verified successfully');
      } else {
        error('Certificate has expired');
      }
    } catch (err) {
      console.error('Error verifying certificate:', err);
      error(err.message || 'Failed to verify certificate');
      setCertificate(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const image = new Image();
        image.onload = async () => {
          const canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            try {
              const data = JSON.parse(code.data);
              if (data.id) {
                setCertificateId(data.id);
                await handleVerify();
              } else {
                error('Invalid QR code format');
              }
            } catch (err) {
              error('Invalid QR code data');
            }
          } else {
            error('No QR code found in image');
          }
        };
        image.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error reading QR code:', err);
      error('Failed to read QR code');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Verify Certificate</h2>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate ID
            </label>
            <input
              type="text"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              placeholder="Enter certificate ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 text-white px-6 py-2 rounded-md ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {loading ? 'Verifying...' : 'Verify Certificate'}
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
            >
              Upload QR Code
            </button>
          </div>
        </form>

        {certificate && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-medium ${certificate.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {certificate.isValid ? 'Valid' : 'Expired'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Course Name</p>
                <p className="font-medium">{certificate.courseName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Recipient</p>
                <p className="font-medium">{certificate.recipient}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Issue Date</p>
                <p className="font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</p>
              </div>
              {certificate.expiryDate && (
                <div>
                  <p className="text-sm text-gray-600">Expiry Date</p>
                  <p className="font-medium">{new Date(certificate.expiryDate).toLocaleDateString()}</p>
                </div>
              )}
              {certificate.description && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-medium">{certificate.description}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyCertificate; 