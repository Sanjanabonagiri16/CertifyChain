import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { success } = useNotification();

  // Get authentication state from localStorage
  const isAdmin = localStorage.getItem('userRole') === 'admin';
  const isUser = localStorage.getItem('userRole') === 'user';
  const username = localStorage.getItem('username');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('userRole');
    localStorage.removeItem('account');
    localStorage.removeItem('username');
    success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-blue-600">CertifyChain</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {(isAdmin || isUser) && (
                <Link
                  to="/verify"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive('/verify')
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Verify Certificate
                </Link>
              )}
              {isUser && (
                <Link
                  to="/issue"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive('/issue')
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Issue Certificate
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link
                    to="/dashboard"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive('/dashboard')
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/certificates"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive('/certificates')
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    My Certificates
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {(isAdmin || isUser) ? (
              <div className="hidden sm:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">{username?.[0]?.toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{username}</span>
                    <span className="text-xs text-gray-500 capitalize">{userRole}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-4">
                <Link
                  to="/admin-login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Admin Login
                </Link>
                <Link
                  to="/user-login"
                  className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 hover:bg-blue-50"
                >
                  User Login
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            {(isAdmin || isUser) && (
              <Link
                to="/verify"
                className={`block px-3 py-2 text-base font-medium ${
                  isActive('/verify')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Verify Certificate
              </Link>
            )}
            {isUser && (
              <Link
                to="/issue"
                className={`block px-3 py-2 text-base font-medium ${
                  isActive('/issue')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Issue Certificate
              </Link>
            )}
            {isAdmin && (
              <>
                <Link
                  to="/dashboard"
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive('/dashboard')
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/certificates"
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive('/certificates')
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  My Certificates
                </Link>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {(isAdmin || isUser) ? (
              <div className="px-4 space-y-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">{username?.[0]?.toUpperCase()}</span>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{username}</div>
                    <div className="text-sm font-medium text-gray-500 capitalize">{userRole}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-4 space-y-3">
                <Link
                  to="/admin-login"
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Admin Login
                </Link>
                <Link
                  to="/user-login"
                  className="w-full flex justify-center items-center px-4 py-2 border border-blue-600 text-base font-medium rounded-md text-blue-600 hover:bg-blue-50"
                >
                  User Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation; 