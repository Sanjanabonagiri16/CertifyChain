import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';

function MyCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { showError } = useNotification();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/certificates/my-certificates`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCertificates(response.data);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificates = certificates.filter(cert => 
    cert.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificate_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadQR = (certificate) => {
    const svg = document.querySelector(`#qr-${certificate.certificate_id}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const url = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.download = `certificate-${certificate.certificate_id}.png`;
      link.href = url;
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
        <div className="w-64">
          <input
            type="text"
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertificates.map(certificate => (
          <div key={certificate.certificate_id} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{certificate.course_name}</h3>
              <p className="text-sm text-gray-600">{certificate.recipient_name}</p>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Certificate ID:</span>
                <span className="font-mono">{certificate.certificate_id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Issue Date:</span>
                <span>{new Date(certificate.issue_date).toLocaleDateString()}</span>
              </div>
              {certificate.expiry_date && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Expiry Date:</span>
                  <span>{new Date(certificate.expiry_date).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className={`capitalize ${
                  certificate.status === 'active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {certificate.status}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Issuer:</span>
                <span>{certificate.issuer_name}</span>
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <QRCodeSVG
                id={`qr-${certificate.certificate_id}`}
                value={`${window.location.origin}/verify/${certificate.certificate_id}`}
                size={150}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => handleDownloadQR(certificate)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Download QR Code
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCertificates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No certificates found.</p>
        </div>
      )}
    </div>
  );
}

export default MyCertificates; 