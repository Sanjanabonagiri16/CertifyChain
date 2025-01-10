import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section with Animation */}
      <div className="container mx-auto px-4 py-24 mt-16">
        <div className="text-center animate-fade-in">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 animate-slide-up">
            Certificate Management System
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto animate-slide-up-delay">
            A secure and efficient way to issue and manage digital certificates using cutting-edge technology.
            Experience the future of certificate management today.
          </p>
          <div className="flex justify-center gap-6 animate-slide-up-delay-2">
            <Link
              to="/admin-login"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300 shadow-lg"
            >
              Admin Login
            </Link>
            <Link
              to="/user-login"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transform hover:scale-105 transition duration-300 shadow-lg"
            >
              User Login
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section with Hover Effects */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
              <div className="text-blue-600 mb-6">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Secure Storage</h3>
              <p className="text-gray-600 text-center text-lg">
                Store and manage certificates securely with advanced encryption technology and real-time backups.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
              <div className="text-blue-600 mb-6">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">QR Code Integration</h3>
              <p className="text-gray-600 text-center text-lg">
                Generate unique QR codes for each certificate, enabling instant verification and access to certificate details.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
              <div className="text-blue-600 mb-6">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Analytics Dashboard</h3>
              <p className="text-gray-600 text-center text-lg">
                Comprehensive analytics and reporting tools to track certificate issuance, verification, and usage patterns.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section with Parallax Effect */}
      <div className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            About Us
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-2xl text-gray-600 mb-8 leading-relaxed">
                We are a leading provider of digital certificate management solutions, dedicated to revolutionizing how organizations handle and distribute certificates in the digital age.
              </p>
              <p className="text-xl text-gray-600 leading-relaxed">
                Our mission is to provide a secure, efficient, and user-friendly platform that simplifies the certificate management process while ensuring the highest levels of security and authenticity.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
                <div className="text-blue-600 mb-6">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Our Vision</h3>
                <p className="text-gray-600 text-center text-lg">
                  To become the global standard for digital certificate management, making certificate verification seamless and trustworthy across all industries.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
                <div className="text-blue-600 mb-6">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Our Values</h3>
                <ul className="text-gray-600 space-y-3 text-lg">
                  <li className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Security First Approach
                  </li>
                  <li className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Innovation in Technology
                  </li>
                  <li className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    User-Centric Design
                  </li>
                  <li className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Reliability & Trust
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
                <div className="text-blue-600 mb-6">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Our Promise</h3>
                <p className="text-gray-600 text-center text-lg">
                  We promise to deliver a reliable, secure, and efficient service that meets the highest standards of digital certificate management, backed by cutting-edge technology and exceptional support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Us Section with Interactive Form */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Contact Us
          </h2>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="bg-gray-50 p-10 rounded-xl shadow-lg transform hover:shadow-2xl transition duration-300">
                <h3 className="text-2xl font-semibold text-gray-900 mb-8">Get in Touch</h3>
                <div className="space-y-8">
                  <div className="flex items-center transform hover:scale-105 transition duration-300">
                    <div className="bg-blue-100 p-4 rounded-full">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-xl font-semibold text-gray-900">Phone</h4>
                      <p className="text-gray-600 text-lg">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center transform hover:scale-105 transition duration-300">
                    <div className="bg-blue-100 p-4 rounded-full">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-xl font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600 text-lg">support@certifychain.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center transform hover:scale-105 transition duration-300">
                    <div className="bg-blue-100 p-4 rounded-full">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-xl font-semibold text-gray-900">Address</h4>
                      <p className="text-gray-600 text-lg">123 Business Street, Tech City, TC 12345</p>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-200">
                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Business Hours</h4>
                    <div className="space-y-3">
                      <p className="text-gray-600 text-lg flex justify-between">
                        <span>Monday - Friday:</span>
                        <span>9:00 AM - 6:00 PM</span>
                      </p>
                      <p className="text-gray-600 text-lg flex justify-between">
                        <span>Saturday:</span>
                        <span>10:00 AM - 4:00 PM</span>
                      </p>
                      <p className="text-gray-600 text-lg flex justify-between">
                        <span>Sunday:</span>
                        <span>Closed</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white p-10 rounded-xl shadow-lg transform hover:shadow-2xl transition duration-300">
                <h3 className="text-2xl font-semibold text-gray-900 mb-8">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="group">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  
                  <div className="group">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                  
                  <div className="group">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Your message here..."
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 px-8 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300 shadow-lg"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add these styles to your CSS */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-in;
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease-out;
        }
        .animate-slide-up-delay {
          animation: slideUp 0.8s ease-out 0.2s both;
        }
        .animate-slide-up-delay-2 {
          animation: slideUp 0.8s ease-out 0.4s both;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default LandingPage; 