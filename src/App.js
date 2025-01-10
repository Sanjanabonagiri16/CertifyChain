import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import UserLogin from './components/UserLogin';
import InstitutionDashboard from './components/InstitutionDashboard';
import IssueCertificate from './components/IssueCertificate';
import MyCertificates from './components/MyCertificates';
import VerifyCertificate from './components/VerifyCertificate';
import { NotificationProvider } from './context/NotificationContext';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <NotificationProvider>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/user-login" element={<UserLogin />} />
              <Route path="/dashboard" element={<InstitutionDashboard />} />
              <Route path="/issue" element={<IssueCertificate />} />
              <Route path="/certificates" element={<MyCertificates />} />
              <Route path="/verify" element={<VerifyCertificate />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </NotificationProvider>
    </Router>
  );
}

export default App; 