import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Certificate } from '../types';
import { CheckCircle, Download, Loader } from 'lucide-react';

export function CertificateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isGeneratingHash, setIsGeneratingHash] = useState(false);

  const generateBlockchainHash = async () => {
    setIsGeneratingHash(true);
    // Simulate blockchain hash generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    const hash = '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    setIsGeneratingHash(false);
    return hash;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    // Generate blockchain hash
    const hash = await generateBlockchainHash();
    
    const certificateData = {
      id: crypto.randomUUID(),
      recipientName: formData.get('recipientName') as string,
      courseName: formData.get('courseName') as string,
      description: formData.get('description') as string,
      issuerName: 'Tech University',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: formData.get('expiryDate') as string || undefined,
      hash,
      status: 'valid' as const
    };
    
    setCertificate(certificateData);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Issue New Certificate</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Name
          </label>
          <input
            name="recipientName"
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Name
          </label>
          <input
            name="courseName"
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            required
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date (Optional)
          </label>
          <input
            name="expiryDate"
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors
            ${isSubmitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSubmitting ? 'Processing...' : 'Issue Certificate'}
        </button>
      </form>

      {isSuccess && certificate && (
        <div className="mt-8 p-6 border border-green-200 rounded-lg bg-green-50">
          <div className="flex items-center space-x-2 mb-6">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <span className="text-green-600 font-medium">Certificate issued successfully!</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-sm text-gray-600">Certificate ID</h3>
                <p className="font-mono text-sm">{certificate.id}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Recipient</h3>
                <p className="font-medium">{certificate.recipientName}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Course</h3>
                <p className="font-medium">{certificate.courseName}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Issue Date</h3>
                <p className="font-medium">{certificate.issueDate}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Blockchain Hash</h3>
                <div className="flex items-center space-x-2">
                  <p className="font-mono text-sm break-all">{certificate.hash}</p>
                  {isGeneratingHash && (
                    <Loader className="h-4 w-4 animate-spin text-blue-600" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              <QRCodeSVG
                value={`https://certifychain.com/verify/${certificate.id}`}
                size={200}
                level="H"
                includeMargin
              />
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}