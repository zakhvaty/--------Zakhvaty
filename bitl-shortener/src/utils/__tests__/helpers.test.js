import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { copyToClipboard, formatUrlForDisplay, debounce, isMobileDevice } from '../helpers';

// Mock navigator.clipboard and document.execCommand
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

// Mock document methods for fallback
Object.defineProperty(document, 'execCommand', {
  value: vi.fn(() => true),
  writable: true,
});

Object.defineProperty(document, 'createElement', {
  value: vi.fn(() => ({
    style: {},
    focus: vi.fn(),
    select: vi.fn(),
  })),
  writable: true,
});

describe('Helper Functions', () => {
  describe('copyToClipboard', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      // Reset window.isSecureContext to true by default
      Object.defineProperty(window, 'isSecureContext', {
        value: true,
        writable: true,
      });
    });

    it('uses clipboard API when available', async () => {
      navigator.clipboard.writeText.mockResolvedValue();
      
      const result = await copyToClipboard('test text');
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
      expect(result).toBe(true);
    });

    it('handles clipboard API errors', async () => {
      navigator.clipboard.writeText.mockRejectedValue(new Error('Clipboard error'));
      
      const result = await copyToClipboard('test text');
      
      expect(result).toBe(false);
    });
  });

  describe('formatUrlForDisplay', () => {
    it('returns original URL when shorter than max length', () => {
      const url = 'https://example.com';
      const result = formatUrlForDisplay(url, 50);
      
      expect(result).toBe(url);
    });

    it('truncates long URLs with ellipsis', () => {
      const longUrl = 'https://example.com/very/long/path/that/exceeds/the/maximum/length';
      const result = formatUrlForDisplay(longUrl, 30);
      
      expect(result).toContain('...');
      expect(result.length).toBeLessThanOrEqual(33); // 30 + '...'
    });

    it('handles empty or null URLs', () => {
      expect(formatUrlForDisplay('', 50)).toBe('');
      expect(formatUrlForDisplay(null, 50)).toBe('');
      expect(formatUrlForDisplay(undefined, 50)).toBe('');
    });

    it('uses default max length of 50', () => {
      const longUrl = 'a'.repeat(100);
      const result = formatUrlForDisplay(longUrl);
      
      expect(result).toContain('...');
    });
  });

  describe('debounce', () => {
    it('delays function execution', async () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();
      
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('cancels previous calls when called multiple times', async () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('passes arguments correctly', async () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 50);
      
      debouncedFn('arg1', 'arg2');
      
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('isMobileDevice', () => {
    const originalUserAgent = navigator.userAgent;
    const originalInnerWidth = window.innerWidth;

    afterEach(() => {
      Object.defineProperty(navigator, 'userAgent', {
        value: originalUserAgent,
        configurable: true
      });
      Object.defineProperty(window, 'innerWidth', {
        value: originalInnerWidth,
        configurable: true
      });
    });

    it('detects mobile user agents', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });
      
      expect(isMobileDevice()).toBe(true);
    });

    it('detects Android devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 10; SM-G975F)',
        configurable: true
      });
      
      expect(isMobileDevice()).toBe(true);
    });

    it('detects mobile based on window width', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        configurable: true
      });
      Object.defineProperty(window, 'innerWidth', {
        value: 500,
        configurable: true
      });
      
      expect(isMobileDevice()).toBe(true);
    });

    it('returns false for desktop', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        configurable: true
      });
      Object.defineProperty(window, 'innerWidth', {
        value: 1200,
        configurable: true
      });
      
      expect(isMobileDevice()).toBe(false);
    });
  });
});