import React, { useState } from 'react';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';

function IssueCertificate() {
  const [formData, setFormData] = useState({
    recipient_name: '',
    recipient_email: '',
    course_name: '',
    issue_date: new Date().toISOString().split('T')[0],
    expiry_date: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.recipient_name.trim()) {
      showError('Recipient name is required');
      return false;
    }

    if (!formData.recipient_email.trim() || !/\S+@\S+\.\S+/.test(formData.recipient_email)) {
      showError('Please enter a valid email address');
      return false;
    }

    if (!formData.course_name.trim()) {
      showError('Course name is required');
      return false;
    }

    if (!formData.issue_date) {
      showError('Issue date is required');
      return false;
    }

    if (formData.expiry_date && new Date(formData.expiry_date) <= new Date(formData.issue_date)) {
      showError('Expiry date must be after the issue date');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/certificates`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      showSuccess('Certificate issued successfully');
      setFormData({
        recipient_name: '',
        recipient_email: '',
        course_name: '',
        issue_date: new Date().toISOString().split('T')[0],
        expiry_date: ''
      });

      // Show the certificate ID to the admin
      showSuccess(`Certificate ID: ${response.data.certificate_id}`);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to issue certificate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                name="recipient_name"
                value={formData.recipient_name}
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
                name="recipient_email"
                value={formData.recipient_email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Certificate Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course/Program Name
            </label>
            <input
              type="text"
              name="course_name"
              value={formData.course_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date
              </label>
              <input
                type="date"
                name="issue_date"
                value={formData.issue_date}
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
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Issuing Certificate...' : 'Issue Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IssueCertificate; 