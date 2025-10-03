import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import ShortURLDisplay from '../components/ShortURLDisplay';
import QRCodeDisplay from '../components/QRCodeDisplay';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const urlData = location.state?.urlData;

  // If no URL data, redirect to home
  React.useEffect(() => {
    if (!urlData) {
      navigate('/', { replace: true });
    }
  }, [urlData, navigate]);

  if (!urlData) {
    return null; // Will redirect
  }

  const handleCreateAnother = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <Logo size="medium" />
            </Link>
            <button
              onClick={handleCreateAnother}
              className="btn-secondary text-sm py-2 px-4"
            >
              Create Another
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Short URL is Ready!
            </h1>
            <p className="text-gray-600">
              Share it with the world or scan the QR code below
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column - URL Display */}
            <div className="order-2 lg:order-1">
              <ShortURLDisplay urlData={urlData} />
            </div>

            {/* Right Column - QR Code */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-start">
              <QRCodeDisplay shortUrl={urlData.short_url} />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleCreateAnother}
                className="btn-primary"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Shorten Another URL
              </button>
              
              <a
                href={urlData.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Original URL
              </a>
            </div>
            
            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tips:</h3>
              <ul className="text-blue-800 text-sm space-y-1 text-left">
                <li>• Bookmark this page to access your short URL later</li>
                <li>• The QR code works great for sharing with mobile users</li>
                <li>• Test your short URL to make sure it works correctly</li>
                <li>• Share responsibly and respect others' content</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ResultPage;