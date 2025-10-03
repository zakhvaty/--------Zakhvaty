import QRCode from 'qrcode';

/**
 * Generate QR code data URL for a given text
 * @param {string} text - Text to encode in QR code
 * @param {object} options - QR code options
 * @returns {Promise<string>} - Data URL of the QR code image
 */
export const generateQRCode = async (text, options = {}) => {
  try {
    const defaultOptions = {
      width: 200,
      height: 200,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    };
    
    const qrOptions = { ...defaultOptions, ...options };
    
    const dataURL = await QRCode.toDataURL(text, qrOptions);
    return dataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

/**
 * Format URL for display (truncate if too long)
 * @param {string} url - URL to format
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Formatted URL
 */
export const formatUrlForDisplay = (url, maxLength = 50) => {
  if (!url) return '';
  
  if (url.length <= maxLength) {
    return url;
  }
  
  const start = url.substring(0, maxLength / 2);
  const end = url.substring(url.length - maxLength / 2);
  
  return `${start}...${end}`;
};

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if running on mobile device
 * @returns {boolean} - True if mobile device
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (window.innerWidth <= 768);
};