import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

function WalletConnection() {
  const [loading, setLoading] = useState(false);
  const { error: notify, success } = useNotification();
  const navigate = useNavigate();

  // Get authentication state from localStorage
  const username = localStorage.getItem('username');
  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'admin';

  const handleLogout = () => {
    // Clear login state
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    success('Logged out successfully');
    navigate('/', { replace: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
        <span className="text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!username) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4">
      <div>
        <p className="text-sm text-gray-600">{isAdmin ? 'Administrator' : 'User'}</p>
        <p className="text-sm text-green-600">Logged In</p>
      </div>
      <button
        onClick={handleLogout}
        className="text-sm text-red-600 hover:text-red-700 transition duration-300"
      >
        Logout
      </button>
    </div>
  );
}

export default WalletConnection; 