import React, { useState, useEffect } from 'react';
import { generateQRCode } from '../utils/helpers';

const QRCodeDisplay = ({ shortUrl, className = '' }) => {
  const [qrCode, setQrCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const generateQR = async () => {
      if (!shortUrl) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        const qrDataUrl = await generateQRCode(shortUrl, {
          width: 200,
          height: 200
        });
        setQrCode(qrDataUrl);
      } catch (err) {
        console.error('Failed to generate QR code:', err);
        setError('Failed to generate QR code');
      } finally {
        setIsLoading(false);
      }
    };

    generateQR();
  }, [shortUrl]);

  if (!shortUrl) return null;

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-700">QR Code</h3>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        {isLoading ? (
          <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-50 rounded">
            <div className="flex flex-col items-center space-y-2">
              <svg className="animate-spin h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm text-gray-600">Generating...</span>
            </div>
          </div>
        ) : error ? (
          <div className="w-[200px] h-[200px] flex items-center justify-center bg-red-50 rounded">
            <div className="flex flex-col items-center space-y-2 text-center">
              <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-red-600">{error}</span>
            </div>
          </div>
        ) : (
          <img 
            src={qrCode} 
            alt="QR Code for shortened URL" 
            className="w-[200px] h-[200px] block"
          />
        )}
      </div>
      
      <p className="text-sm text-gray-600 text-center max-w-xs">
        Scan this QR code to open the link on your mobile device
      </p>
    </div>
  );
};

export default QRCodeDisplay;