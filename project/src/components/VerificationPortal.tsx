import React, { useState, useRef } from 'react';
import { Search, CheckCircle, XCircle, Camera, Upload, Loader } from 'lucide-react';
import type { Certificate } from '../types';

export function VerificationPortal() {
  const [certificateId, setCertificateId] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isVerifyingHash, setIsVerifyingHash] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const verifyBlockchainHash = async (hash: string) => {
    setIsVerifyingHash(true);
    // Simulate blockchain verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsVerifyingHash(false);
    return true;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateId) return;
    
    setVerificationStatus('loading');
    
    // Mock certificate data
    const mockCertificate = {
      id: certificateId,
      recipientName: "John Doe",
      courseName: "Blockchain Development",
      issuerName: "Tech University",
      issueDate: "2024-03-15",
      description: "Successfully completed the advanced blockchain development course",
      hash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
      status: "valid" as const
    };
    
    // Verify the blockchain hash
    const isValid = await verifyBlockchainHash(mockCertificate.hash);
    
    setCertificate(mockCertificate);
    setVerificationStatus(isValid ? 'valid' : 'invalid');
  };

  const handleQRUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Verify Certificate</h2>
      
      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleQRUpload}
          className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Upload className="h-5 w-5 text-gray-600" />
          <span className="text-gray-700">Upload QR Code</span>
        </button>
        <button
          className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Camera className="h-5 w-5 text-gray-600" />
          <span className="text-gray-700">Scan QR Code</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setCertificateId('DEMO-CERT-001');
              handleVerify(new Event('submit') as any);
            }
          }}
        />
      </div>
      
      <form onSubmit={handleVerify} className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            placeholder="Enter Certificate ID"
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        </div>

        <button
          type="submit"
          disabled={verificationStatus === 'loading' || !certificateId}
          className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors
            ${verificationStatus === 'loading' || !certificateId
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {verificationStatus === 'loading' ? (
            <span className="flex items-center justify-center space-x-2">
              <Loader className="h-5 w-5 animate-spin" />
              <span>Verifying...</span>
            </span>
          ) : (
            'Verify Certificate'
          )}
        </button>
      </form>

      {certificate && (verificationStatus === 'valid' || verificationStatus === 'invalid') && (
        <div className={`mt-8 p-6 border rounded-lg ${
          verificationStatus === 'valid' 
            ? 'border-green-200 bg-green-50' 
            : 'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-center space-x-2 mb-4">
            {verificationStatus === 'valid' ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-600" />
                <span className="text-green-600 font-medium">Certificate Verified</span>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-600" />
                <span className="text-red-600 font-medium">Invalid Certificate</span>
              </>
            )}
          </div>
          
          {verificationStatus === 'valid' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-600">Recipient</h3>
                <p className="font-medium">{certificate.recipientName}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Course</h3>
                <p className="font-medium">{certificate.courseName}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Issuer</h3>
                <p className="font-medium">{certificate.issuerName}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Issue Date</h3>
                <p className="font-medium">{certificate.issueDate}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Blockchain Hash</h3>
                <div className="flex items-center space-x-2">
                  <p className="font-mono text-sm break-all">{certificate.hash}</p>
                  {isVerifyingHash && (
                    <Loader className="h-4 w-4 animate-spin text-blue-600" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}