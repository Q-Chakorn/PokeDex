import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { LoadingSpinner, PokeBallSpinner } from '../LoadingSpinner';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }),
});

const renderWithI18n = (component: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  );
};

describe('LoadingSpinner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render loading spinner with default props', () => {
    renderWithI18n(<LoadingSpinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Loading Pokémon...');
  });

  it('should render with custom message', () => {
    const customMessage = 'Loading data...';
    renderWithI18n(<LoadingSpinner message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', customMessage);
  });

  it('should apply small size classes', () => {
    renderWithI18n(<LoadingSpinner size="sm" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-4', 'h-4');
  });

  it('should apply medium size classes (default)', () => {
    renderWithI18n(<LoadingSpinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-8', 'h-8');
  });

  it('should apply large size classes', () => {
    renderWithI18n(<LoadingSpinner size="lg" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-12', 'h-12');
  });

  it('should apply xl size classes', () => {
    renderWithI18n(<LoadingSpinner size="xl" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-16', 'h-16');
  });

  it('should apply primary variant classes (default)', () => {
    renderWithI18n(<LoadingSpinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('text-blue-600');
  });

  it('should apply secondary variant classes', () => {
    renderWithI18n(<LoadingSpinner variant="secondary" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('text-gray-600');
  });

  it('should apply white variant classes', () => {
    renderWithI18n(<LoadingSpinner variant="white" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('text-white');
  });

  it('should apply custom className', () => {
    const { container } = renderWithI18n(<LoadingSpinner className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should have spin animation', () => {
    renderWithI18n(<LoadingSpinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('animate-spin');
  });

  it('should render SVG spinner', () => {
    renderWithI18n(<LoadingSpinner />);

    const svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });
});

describe('PokeBallSpinner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render pokeball spinner with default props', () => {
    renderWithI18n(<PokeBallSpinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Loading Pokémon...');
  });

  it('should render with custom message', () => {
    const customMessage = 'Loading Pokémon data...';
    renderWithI18n(<PokeBallSpinner message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', customMessage);
  });

  it('should apply small size classes', () => {
    renderWithI18n(<PokeBallSpinner size="sm" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-6', 'h-6');
  });

  it('should apply medium size classes (default)', () => {
    renderWithI18n(<PokeBallSpinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-10', 'h-10');
  });

  it('should apply large size classes', () => {
    renderWithI18n(<PokeBallSpinner size="lg" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-16', 'h-16');
  });

  it('should apply xl size classes', () => {
    renderWithI18n(<PokeBallSpinner size="xl" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-20', 'h-20');
  });

  it('should have spin animation', () => {
    renderWithI18n(<PokeBallSpinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('animate-spin');
  });

  it('should apply custom className', () => {
    const { container } = renderWithI18n(<PokeBallSpinner className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should have pokeball styling elements', () => {
    renderWithI18n(<PokeBallSpinner />);

    const spinner = screen.getByRole('status');
    
    // Check for pokeball structure
    expect(spinner.querySelector('.bg-red-500')).toBeInTheDocument();
    expect(spinner.querySelector('.bg-white')).toBeInTheDocument();
    expect(spinner.querySelector('.bg-gray-800')).toBeInTheDocument();
  });
});