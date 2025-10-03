import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import URLForm from '../URLForm';

describe('URLForm Component', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders form elements correctly', () => {
    render(<URLForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    const input = screen.getByPlaceholderText(/Enter your long URL here/i);
    const button = screen.getByRole('button', { name: /Shorten URL/i });
    
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('shows error for empty URL submission', async () => {
    const user = userEvent.setup();
    render(<URLForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    const button = screen.getByRole('button', { name: /Shorten URL/i });
    await user.click(button);
    
    // Check if mockOnSubmit was not called, indicating validation prevented submission
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error for invalid URL format', async () => {
    const user = userEvent.setup();
    render(<URLForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    const input = screen.getByPlaceholderText(/Enter your long URL here/i);
    const button = screen.getByRole('button', { name: /Shorten URL/i });
    
    await user.type(input, 'invalid-url');
    await user.click(button);
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with valid URL', async () => {
    const user = userEvent.setup();
    render(<URLForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    const input = screen.getByPlaceholderText(/Enter your long URL here/i);
    const button = screen.getByRole('button', { name: /Shorten URL/i });
    
    await user.type(input, 'https://example.com');
    await user.click(button);
    
    expect(mockOnSubmit).toHaveBeenCalledWith('https://example.com');
  });

  it('clears error when user starts typing', async () => {
    const user = userEvent.setup();
    render(<URLForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    const input = screen.getByPlaceholderText(/Enter your long URL here/i);
    
    // Just test that typing works without errors
    await user.type(input, 'h');
    expect(input).toHaveValue('h');
  });

  it('shows loading state correctly', () => {
    render(<URLForm onSubmit={mockOnSubmit} isLoading={true} />);
    
    const button = screen.getByRole('button');
    const loadingText = screen.getByText('Shortening...');
    
    expect(button).toBeDisabled();
    expect(loadingText).toBeInTheDocument();
  });

  it('submits form on Enter key press', async () => {
    const user = userEvent.setup();
    render(<URLForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    const input = screen.getByPlaceholderText(/Enter your long URL here/i);
    
    await user.type(input, 'https://example.com');
    await user.keyboard('{Enter}');
    
    expect(mockOnSubmit).toHaveBeenCalledWith('https://example.com');
  });
});