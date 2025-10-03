import React from 'react';

const Footer = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`text-center text-gray-500 text-sm py-6 ${className}`}>
      <p>
        © {currentYear} bitl.site - Simple URL shortening service
      </p>
      <p className="mt-1 text-xs">
        Built with ❤️ for simplicity
      </p>
    </footer>
  );
};

export default Footer;