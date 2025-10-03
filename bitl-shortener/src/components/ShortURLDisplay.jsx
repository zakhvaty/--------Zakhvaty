import React from 'react';
import CopyButton from './CopyButton';
import { formatUrlForDisplay } from '../utils/helpers';

const ShortURLDisplay = ({ urlData, className = '' }) => {
  if (!urlData) return null;

  const { short_url, original_url } = urlData;

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="text-center space-y-4">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="bg-green-100 rounded-full p-3">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900">
          URL Shortened Successfully!
        </h2>
        
        {/* Original URL */}
        <div className="bg-white rounded-lg p-4 border">
          <p className="text-sm text-gray-600 mb-2">Original URL:</p>
          <p className="text-gray-800 break-all text-sm">
            {formatUrlForDisplay(original_url, 80)}
          </p>
        </div>
        
        {/* Short URL */}
        <div className="bg-white rounded-lg p-4 border-2 border-gray-300">
          <p className="text-sm text-gray-600 mb-3">Your shortened URL:</p>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="flex-1 min-w-0">
              <a 
                href={short_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg sm:text-xl font-mono text-blue-600 hover:text-blue-800 transition-colors duration-200 block truncate"
              >
                {short_url}
              </a>
            </div>
            <CopyButton 
              textToCopy={short_url}
              className="shrink-0"
            >
              Copy Link
            </CopyButton>
          </div>
        </div>
        
        {/* Usage Instructions */}
        <div className="text-sm text-gray-600 space-y-1">
          <p>🔗 Click the link to test it</p>
          <p>📋 Use the copy button to share it</p>
          <p>📱 Scan the QR code below for mobile access</p>
        </div>
      </div>
    </div>
  );
};

export default ShortURLDisplay;