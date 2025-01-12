import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  const auth = JSON.parse(localStorage.getItem('auth') || '{}');
  const user = auth.user || {};
  const token = auth.token;

  // Check if user is not authenticated
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if 2FA is required but not completed
  if (user.requires2FA && !user.is2FAVerified && location.pathname !== '/2fa/verify') {
    return <Navigate to="/2fa/verify" state={{ from: location, tempToken: token }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute; 