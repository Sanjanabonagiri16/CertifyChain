import React, { useState } from 'react';
import { Header } from './components/Header';
import { CertificateForm } from './components/CertificateForm';
import { VerificationPortal } from './components/VerificationPortal';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<'issue' | 'verify' | 'dashboard'>('issue');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 flex justify-center space-x-4">
          <button
            onClick={() => setActiveTab('issue')}
            className={`px-6 py-2 rounded-full font-medium transition-colors
              ${activeTab === 'issue'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            Issue Certificate
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`px-6 py-2 rounded-full font-medium transition-colors
              ${activeTab === 'verify'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            Verify Certificate
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-2 rounded-full font-medium transition-colors
              ${activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            Dashboard
          </button>
        </div>

        {activeTab === 'issue' && <CertificateForm />}
        {activeTab === 'verify' && <VerificationPortal />}
        {activeTab === 'dashboard' && <Dashboard />}
      </main>
    </div>
  );
}