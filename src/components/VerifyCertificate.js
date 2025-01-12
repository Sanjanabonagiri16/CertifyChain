import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';

function VerifyCertificate() {
  const [certificateId, setCertificateId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setVerificationResult(null);

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/certificates/verify/${certificateId}`);
      setVerificationResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Verify Certificate</h1>
        <p className="text-gray-600">
          Enter the certificate ID to verify its authenticity
        </p>
      </div>

      <form onSubmit={handleVerify} className="max-w-md mx-auto mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            placeholder="Enter Certificate ID"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </form>

      {error && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {verificationResult && (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center mb-6">
            {verificationResult.valid ? (
              <div className="flex items-center text-green-600">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-lg font-semibold">Certificate Verified</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-lg font-semibold">Invalid Certificate</span>
              </div>
            )}
          </div>

          {verificationResult.valid && verificationResult.certificate && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Recipient</p>
                  <p className="font-semibold">{verificationResult.certificate.recipient_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Course</p>
                  <p className="font-semibold">{verificationResult.certificate.course_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Issue Date</p>
                  <p className="font-semibold">
                    {new Date(verificationResult.certificate.issue_date).toLocaleDateString()}
                  </p>
                </div>
                {verificationResult.certificate.expiry_date && (
                  <div>
                    <p className="text-sm text-gray-600">Expiry Date</p>
                    <p className="font-semibold">
                      {new Date(verificationResult.certificate.expiry_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Issuer</p>
                  <p className="font-semibold">{verificationResult.certificate.issuer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold capitalize">{verificationResult.certificate.status}</p>
                </div>
              </div>

              <div className="flex justify-center">
                <QRCodeSVG
                  value={`${window.location.origin}/verify/${certificateId}`}
                  size={150}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default VerifyCertificate; 