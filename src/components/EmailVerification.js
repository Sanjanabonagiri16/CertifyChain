import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EmailVerification() {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.post(`http://localhost:5000/api/profile/verify-email/${token}`);
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Email verification failed. Please try again.');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  const handleResendVerification = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.post('http://localhost:5000/api/profile/verify-email/request', {
        email: user.email
      });
      setMessage('Verification email has been resent. Please check your inbox.');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to resend verification email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>

        <div className={`mt-8 text-center ${
          status === 'success' ? 'text-green-600' : 
          status === 'error' ? 'text-red-600' : 
          'text-gray-600'
        }`}>
          {status === 'verifying' ? (
            <div className="animate-pulse">Verifying your email...</div>
          ) : (
            <div>
              <p className="mb-4">{message}</p>
              {status === 'error' && (
                <button
                  onClick={handleResendVerification}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Resend Verification Email
                </button>
              )}
            </div>
          )}
        </div>

        {status === 'success' && (
          <div className="text-center text-sm text-gray-600">
            Redirecting to login page...
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailVerification; 