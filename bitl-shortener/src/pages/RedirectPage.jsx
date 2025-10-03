import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOriginalUrl } from '../services/urlService';
import Logo from '../components/Logo';

const RedirectPage = () => {
  const { shortId } = useParams();
  const [status, setStatus] = useState('loading'); // loading, redirecting, notFound, error
  const [countdown, setCountdown] = useState(3);
  const [urlData, setUrlData] = useState(null);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!shortId) {
        setStatus('notFound');
        return;
      }

      try {
        const { data, error } = await getOriginalUrl(shortId);
        
        if (error) {
          if (error.status === 404) {
            setStatus('notFound');
          } else {
            setStatus('error');
          }
          return;
        }

        if (data && data.original_url) {
          setUrlData(data);
          setStatus('redirecting');
          
          // Start countdown
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                window.location.href = data.original_url;
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          // Cleanup on unmount
          return () => clearInterval(timer);
        } else {
          setStatus('notFound');
        }
      } catch (err) {
        console.error('Redirect error:', err);
        setStatus('error');
      }
    };

    handleRedirect();
  }, [shortId]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-gray-300 border-t-primary-600 rounded-full mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
            <p className="text-gray-600">Looking up your URL...</p>
          </div>
        );
        
      case 'redirecting':
        return (
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Redirecting in {countdown}...</h2>
            <p className="text-gray-600 mb-6">Taking you to:</p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
              <p className="text-gray-800 break-all">{urlData?.original_url}</p>
            </div>
            
            <div className="space-y-4">
              <a
                href={urlData?.original_url}
                className="btn-primary inline-flex items-center"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Go Now
              </a>
            </div>
          </div>
        );
        
      case 'notFound':
        return (
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">URL Not Found</h2>
            <p className="text-gray-600 mb-6">
              The short URL <span className="font-mono bg-gray-100 px-2 py-1 rounded">{shortId}</span> doesn't exist or has expired.
            </p>
            
            <div className="space-y-4">
              <Link to="/" className="btn-primary">
                Create a Short URL
              </Link>
              <p className="text-sm text-gray-500">
                Double-check the URL and try again, or create a new short link.
              </p>
            </div>
          </div>
        );
        
      case 'error':
      default:
        return (
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something Went Wrong</h2>
            <p className="text-gray-600 mb-6">
              We encountered an error while trying to redirect you. Please try again.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary mr-4"
              >
                Try Again
              </button>
              <Link to="/" className="btn-primary">
                Go Home
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="py-6">
        <div className="container mx-auto px-4 text-center">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <Logo size="medium" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>© 2024 bitl.site - Simple URL shortening service</p>
      </footer>
    </div>
  );
};

export default RedirectPage;