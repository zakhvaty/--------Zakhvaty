import { describe, it, expect, vi } from 'vitest';
import { validateUrl, createShortUrl } from '../urlService';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn()
        }))
      }))
    }))
  },
  isDemoMode: true
}));

describe('URL Service', () => {
  describe('validateUrl', () => {
    it('returns true for valid HTTP URLs', () => {
      expect(validateUrl('http://example.com')).toBe(true);
      expect(validateUrl('http://www.example.com')).toBe(true);
      expect(validateUrl('http://example.com/path')).toBe(true);
    });

    it('returns true for valid HTTPS URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('https://www.example.com')).toBe(true);
      expect(validateUrl('https://example.com/path?query=1')).toBe(true);
    });

    it('returns false for invalid URLs', () => {
      expect(validateUrl('example.com')).toBe(false);
      expect(validateUrl('ftp://example.com')).toBe(false);
      expect(validateUrl('not-a-url')).toBe(false);
      expect(validateUrl('')).toBe(false);
      expect(validateUrl(null)).toBe(false);
      expect(validateUrl(undefined)).toBe(false);
    });

    it('returns false for non-string inputs', () => {
      expect(validateUrl(123)).toBe(false);
      expect(validateUrl({})).toBe(false);
      expect(validateUrl([])).toBe(false);
    });
  });

  describe('createShortUrl', () => {
    it('returns error for invalid URL', async () => {
      const result = await createShortUrl('invalid-url');
      
      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error.message).toContain('valid URL');
    });

    it('creates short URL in demo mode', async () => {
      const result = await createShortUrl('https://example.com');
      
      expect(result.error).toBeNull();
      expect(result.data).toBeDefined();
      expect(result.data.original_url).toBe('https://example.com');
      expect(result.data.short_id).toBeDefined();
      expect(result.data.short_url).toBeDefined();
      expect(result.data.id).toBeDefined();
    });

    it('normalizes URLs by trimming whitespace', async () => {
      const result = await createShortUrl('  https://example.com  ');
      
      expect(result.data.original_url).toBe('https://example.com');
    });

    it('generates unique short IDs', async () => {
      const result1 = await createShortUrl('https://example1.com');
      const result2 = await createShortUrl('https://example2.com');
      
      expect(result1.data.short_id).not.toBe(result2.data.short_id);
    });

    it('includes created timestamp', async () => {
      const result = await createShortUrl('https://example.com');
      
      expect(result.data.created_at).toBeDefined();
      expect(new Date(result.data.created_at)).toBeInstanceOf(Date);
    });
  });
});