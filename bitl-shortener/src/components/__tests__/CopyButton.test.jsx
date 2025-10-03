import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CopyButton from '../CopyButton';

// Mock the clipboard API
const mockWriteText = vi.fn();
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  writable: true,
});

// Mock window.isSecureContext
Object.defineProperty(window, 'isSecureContext', {
  value: true,
  writable: true,
});

describe('CopyButton Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default copy text', () => {
    render(<CopyButton textToCopy="test text" />);
    
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('renders with custom children text', () => {
    render(<CopyButton textToCopy="test text">Copy Link</CopyButton>);
    
    expect(screen.getByText('Copy Link')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CopyButton textToCopy="test text" className="custom-class" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('has correct button structure', () => {
    render(<CopyButton textToCopy="test text" />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-secondary');
  });
});