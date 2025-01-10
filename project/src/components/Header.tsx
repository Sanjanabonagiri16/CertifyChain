import React from 'react';
import { Shield } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8" />
            <h1 className="text-2xl font-bold">CertifyChain</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#issue" className="hover:text-blue-200 transition-colors">Issue Certificate</a>
            <a href="#verify" className="hover:text-blue-200 transition-colors">Verify Certificate</a>
            <a href="#dashboard" className="hover:text-blue-200 transition-colors">Dashboard</a>
          </nav>
        </div>
      </div>
    </header>
  );
}