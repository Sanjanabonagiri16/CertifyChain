import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { QRCodeSVG } from 'qrcode.react';

function IssueCertificate() {
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    certificateType: 'course',
    courseName: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    description: '',
    achievements: ''
  });

  const [issuedCertificate, setIssuedCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { success, error } = useNotification();

  // Get authentication state from localStorage
  const isUser = localStorage.getItem('userRole') === 'user';
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!isUser) {
      error('Only authorized users can issue certificates');
      navigate('/');
    }
  }, [isUser, navigate, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.recipientName.trim()) {
      error('Recipient name is required');
      return false;
    }

    if (!formData.recipientEmail.trim() || !/\S+@\S+\.\S+/.test(formData.recipientEmail)) {
      error('Please enter a valid email address');
      return false;
    }

    if (!formData.courseName.trim()) {
      error('Course name is required');
      return false;
    }

    if (!formData.issueDate) {
      error('Issue date is required');
      return false;
    }

    if (formData.expiryDate && new Date(formData.expiryDate) <= new Date(formData.issueDate)) {
      error('Expiry date must be after the issue date');
      return false;
    }

    if (!formData.description.trim()) {
      error('Description is required');
      return false;
    }

    return true;
  };

  const generateCertificateId = () => {
    return 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const certificateId = generateCertificateId();
      const timestamp = new Date().toISOString();

      const newCertificate = {
        id: certificateId,
        recipient: formData.recipientName,
        recipientEmail: formData.recipientEmail,
        courseName: formData.courseName,
        certificateType: formData.certificateType,
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate || null,
        description: formData.description,
        achievements: formData.achievements,
        issuedBy: username,
        isValid: true
      };

      // Get existing certificates
      const existingCertificates = JSON.parse(localStorage.getItem('certificates') || '[]');
      // Add new certificate
      const updatedCertificates = [...existingCertificates, newCertificate];
      // Save to localStorage
      localStorage.setItem('certificates', JSON.stringify(updatedCertificates));

      setIssuedCertificate(newCertificate);
      success('Certificate issued successfully');

      // Reset form
      setFormData({
        recipientName: '',
        recipientEmail: '',
        certificateType: 'course',
        courseName: '',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        description: '',
        achievements: ''
      });
    } catch (err) {
      error(err.message || 'Failed to issue certificate');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isUser) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <p className="text-red-600">Only authorized users can issue certificates.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Issue New Certificate</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Name
              </label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Email
              </label>
              <input
                type="email"
                name="recipientEmail"
                value={formData.recipientEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Certificate Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Type
              </label>
              <select
                name="certificateType"
                value={formData.certificateType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="course">Course Completion</option>
                <option value="degree">Degree</option>
                <option value="achievement">Achievement</option>
                <option value="participation">Participation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course/Program Name
              </label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date
              </label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description and Achievements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Achievements/Additional Information (Optional)
            </label>
            <textarea
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-blue-600 text-white px-6 py-2 rounded-md ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Issuing Certificate...' : 'Issue Certificate'}
            </button>
          </div>
        </form>

        {/* Certificate Issued Result */}
        {issuedCertificate && (
          <div className="mt-8 border-t pt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Certificate Issued Successfully</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Certificate ID</p>
                  <p className="font-mono text-sm break-all">{issuedCertificate.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Recipient</p>
                  <p className="font-medium">{issuedCertificate.recipientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Course</p>
                  <p className="font-medium">{issuedCertificate.courseName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Issue Date</p>
                  <p className="font-medium">{new Date(issuedCertificate.issueDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center space-y-4">
                <QRCodeSVG
                  value={JSON.stringify({
                    id: issuedCertificate.id,
                    type: 'certificate'
                  })}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
                <button
                  onClick={() => {
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
                      link.download = `certificate-${issuedCertificate.id}.png`;
                      link.href = url;
                      link.click();
                    };
                    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Download QR Code
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IssueCertificate; 