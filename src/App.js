import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import EmailVerification from './components/EmailVerification';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import Profile from './components/Profile';
import ChangePassword from './components/ChangePassword';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import VerifyCertificate from './components/VerifyCertificate';
import IssueCertificate from './components/IssueCertificate';
import MyCertificates from './components/MyCertificates';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Public Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email/:token" element={<EmailVerification />} />
            <Route path="/verify/:certificateId?" element={<VerifyCertificate />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute requireAdmin>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/change-password"
              element={
                <PrivateRoute>
                  <ChangePassword />
                </PrivateRoute>
              }
            />
            <Route
              path="/certificates/issue"
              element={
                <PrivateRoute requireAdmin>
                  <IssueCertificate />
                </PrivateRoute>
              }
            />
            <Route
              path="/certificates/my"
              element={
                <PrivateRoute>
                  <MyCertificates />
                </PrivateRoute>
              }
            />

            {/* Password Reset Routes */}
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App; 