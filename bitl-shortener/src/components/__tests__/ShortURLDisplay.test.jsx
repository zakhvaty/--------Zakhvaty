import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ShortURLDisplay from '../ShortURLDisplay';

// Mock CopyButton component
vi.mock('../CopyButton', () => ({
  default: ({ textToCopy, children }) => (
    <button data-testid="copy-button" data-text={textToCopy}>
      {children}
    </button>
  ),
}));

// Mock helpers
vi.mock('../../utils/helpers', () => ({
  formatUrlForDisplay: (url, length) => url.length > length ? `${url.substring(0, length)}...` : url,
}));

describe('ShortURLDisplay Component', () => {
  const mockUrlData = {
    short_url: 'https://bitl.site/s/abc123',
    original_url: 'https://example.com/very/long/url/path',
    id: '123',
    short_id: 'abc123',
    created_at: '2024-01-01T00:00:00.000Z'
  };

  it('renders nothing when no urlData provided', () => {
    const { container } = render(<ShortURLDisplay urlData={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders success message and URLs when urlData provided', () => {
    render(<ShortURLDisplay urlData={mockUrlData} />);
    
    expect(screen.getByText('URL Shortened Successfully!')).toBeInTheDocument();
    expect(screen.getByText('Original URL:')).toBeInTheDocument();
    expect(screen.getByText('Your shortened URL:')).toBeInTheDocument();
  });

  it('displays the short URL as a clickable link', () => {
    render(<ShortURLDisplay urlData={mockUrlData} />);
    
    const shortUrlLink = screen.getByRole('link');
    expect(shortUrlLink).toHaveAttribute('href', mockUrlData.short_url);
    expect(shortUrlLink).toHaveAttribute('target', '_blank');
    expect(shortUrlLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('includes copy button with correct text', () => {
    render(<ShortURLDisplay urlData={mockUrlData} />);
    
    const copyButton = screen.getByTestId('copy-button');
    expect(copyButton).toHaveAttribute('data-text', mockUrlData.short_url);
    expect(copyButton).toHaveTextContent('Copy Link');
  });

  it('displays usage instructions', () => {
    render(<ShortURLDisplay urlData={mockUrlData} />);
    
    expect(screen.getByText('🔗 Click the link to test it')).toBeInTheDocument();
    expect(screen.getByText('📋 Use the copy button to share it')).toBeInTheDocument();
    expect(screen.getByText('📱 Scan the QR code below for mobile access')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<ShortURLDisplay urlData={mockUrlData} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('displays formatted original URL', () => {
    render(<ShortURLDisplay urlData={mockUrlData} />);
    
    // The formatted URL should be displayed
    expect(screen.getByText(/example\.com/)).toBeInTheDocument();
  });
});