import { supabase, isDemoMode } from '../lib/supabase.js';

// URL validation regex
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

// Generate random short ID
const generateShortId = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let shortId = '';
  for (let i = 0; i < 6; i++) {
    shortId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return shortId;
};

// Mock data for demo mode
let mockUrls = new Map();

/**
 * Validate URL format
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return URL_REGEX.test(url.trim());
};

/**
 * Create a shortened URL
 * @param {string} originalUrl - The original long URL
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const createShortUrl = async (originalUrl) => {
  try {
    // Validate URL
    if (!validateUrl(originalUrl)) {
      return {
        data: null,
        error: { message: 'Please enter a valid URL starting with http:// or https://' }
      };
    }

    // Normalize URL
    const normalizedUrl = originalUrl.trim();
    
    if (isDemoMode) {
      // Demo mode - use mock data
      const shortId = generateShortId();
      const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173';
      const shortUrl = `${appUrl}/s/${shortId}`;
      
      const urlData = {
        id: crypto.randomUUID(),
        short_id: shortId,
        original_url: normalizedUrl,
        short_url: shortUrl,
        created_at: new Date().toISOString()
      };
      
      mockUrls.set(shortId, urlData);
      
      return { data: urlData, error: null };
    }

    // Production mode - use Supabase
    let shortId;
    let attempts = 0;
    const maxAttempts = 5;
    
    // Generate unique short ID
    do {
      shortId = generateShortId();
      const { data: existing } = await supabase
        .from('urls')
        .select('short_id')
        .eq('short_id', shortId)
        .single();
      
      if (!existing) break;
      attempts++;
    } while (attempts < maxAttempts);
    
    if (attempts >= maxAttempts) {
      return {
        data: null,
        error: { message: 'Unable to generate unique short URL. Please try again.' }
      };
    }
    
    // Insert into database
    const { data, error } = await supabase
      .from('urls')
      .insert({
        short_id: shortId,
        original_url: normalizedUrl
      })
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return {
        data: null,
        error: { message: 'Failed to create short URL. Please try again.' }
      };
    }
    
    // Add the full short URL to the response
    const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const shortUrl = `${appUrl}/s/${data.short_id}`;
    
    return {
      data: { ...data, short_url: shortUrl },
      error: null
    };
    
  } catch (err) {
    console.error('Unexpected error:', err);
    return {
      data: null,
      error: { message: 'An unexpected error occurred. Please try again.' }
    };
  }
};

/**
 * Get original URL by short ID
 * @param {string} shortId - The short ID to look up
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const getOriginalUrl = async (shortId) => {
  try {
    if (isDemoMode) {
      // Demo mode - use mock data
      const urlData = mockUrls.get(shortId);
      if (urlData) {
        return { data: urlData, error: null };
      } else {
        return {
          data: null,
          error: { message: 'Short URL not found', status: 404 }
        };
      }
    }

    // Production mode - use Supabase
    const { data, error } = await supabase
      .from('urls')
      .select('*')
      .eq('short_id', shortId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return {
          data: null,
          error: { message: 'Short URL not found', status: 404 }
        };
      }
      console.error('Supabase error:', error);
      return {
        data: null,
        error: { message: 'Failed to retrieve URL. Please try again.' }
      };
    }
    
    return { data, error: null };
    
  } catch (err) {
    console.error('Unexpected error:', err);
    return {
      data: null,
      error: { message: 'An unexpected error occurred. Please try again.' }
    };
  }
};