import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Logo from '../Logo';

describe('Logo Component', () => {
  it('renders the logo with default size', () => {
    render(<Logo />);
    
    const logoElement = screen.getByText('bitl');
    const siteElement = screen.getByText('.site');
    
    expect(logoElement).toBeInTheDocument();
    expect(siteElement).toBeInTheDocument();
  });

  it('applies the correct size classes', () => {
    const { container } = render(<Logo size="small" />);
    const logoDiv = container.firstChild;
    
    expect(logoDiv).toHaveClass('text-xl');
  });

  it('applies custom className', () => {
    const { container } = render(<Logo className="custom-class" />);
    const logoDiv = container.firstChild;
    
    expect(logoDiv).toHaveClass('custom-class');
  });

  it('has correct styling classes', () => {
    const { container } = render(<Logo />);
    const logoDiv = container.firstChild;
    
    expect(logoDiv).toHaveClass('font-bold', 'text-gray-900');
  });
});