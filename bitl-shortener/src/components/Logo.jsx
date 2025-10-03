import React from 'react';

const Logo = ({ size = 'large', className = '' }) => {
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-4xl md:text-5xl'
  };

  return (
    <div className={`font-bold text-gray-900 ${sizeClasses[size]} ${className}`}>
      <span className="tracking-tight">bitl</span>
      <span className="text-gray-600">.site</span>
    </div>
  );
};

export default Logo;