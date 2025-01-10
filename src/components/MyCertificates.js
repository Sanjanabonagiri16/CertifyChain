import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { QRCodeSVG } from 'qrcode.react';

function MyCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState(null);
  const navigate = useNavigate();
  const { success, error } = useNotification();

  // Get authentication state from localStorage
  const isAdmin = localStorage.getItem('userRole') === 'admin';
  const username = localStorage.getItem('username');

  useEffect(() => {
    // Check if user is logged in
    if (!username) {
      error('Please login to view certificates');
      navigate('/');
      return;
    }

    // Load certificates from localStorage
    const loadCertificates = () => {
      const storedCertificates = JSON.parse(localStorage.getItem('certificates') || '[]');
      // Filter certificates based on user role
      const filteredCertificates = isAdmin 
        ? storedCertificates // Admin sees all certificates
        : storedCertificates.filter(cert => cert.recipient === username); // Users see only their certificates
      setCertificates(filteredCertificates);
    };

    loadCertificates();
  }, [username, isAdmin, navigate, error]);

  const filteredCertificates = certificates.filter(cert => 
    cert.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (certificate) => {
    setCertificateToDelete(certificate);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      // Get all certificates from localStorage
      const allCertificates = JSON.parse(localStorage.getItem('certificates') || '[]');
      // Filter out the certificate to delete
      const updatedCertificates = allCertificates.filter(cert => cert.id !== certificateToDelete.id);
      // Save back to localStorage
      localStorage.setItem('certificates', JSON.stringify(updatedCertificates));
      // Update state
      setCertificates(prev => prev.filter(cert => cert.id !== certificateToDelete.id));
      success('Certificate deleted successfully');
      setShowDeleteModal(false);
      setCertificateToDelete(null);
    } catch (err) {
      error(err.message || 'Failed to delete certificate');
    }
  };

  const handleDownloadQR = (certificate) => {
    const svg = document.querySelector("svg");
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
      link.download = `certificate-${certificate.id}.png`;
      link.href = url;
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

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
          <div key={certificate.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{certificate.courseName}</h3>
                <p className="text-sm text-gray-600">{certificate.recipient}</p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => handleDeleteClick(certificate)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Certificate ID:</span>
                <span className="font-mono">{certificate.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Issue Date:</span>
                <span>{new Date(certificate.issueDate).toLocaleDateString()}</span>
              </div>
              {certificate.expiryDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Expiry Date:</span>
                  <span>{new Date(certificate.expiryDate).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="capitalize">{certificate.certificateType}</span>
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <QRCodeSVG
                value={JSON.stringify({
                  id: certificate.id,
                  type: 'certificate'
                })}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this certificate? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCertificateToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredCertificates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No certificates found.</p>
        </div>
      )}
    </div>
  );
}

export default MyCertificates; 