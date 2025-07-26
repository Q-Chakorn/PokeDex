import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { TypeBadge } from '../TypeBadge';
import type { PokemonType } from '../../../types/pokemon';

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

const mockFireType: PokemonType = {
  name: 'fire',
  color: '#F08030'
};

const mockWaterType: PokemonType = {
  name: 'water',
  color: '#6890F0'
};

describe('TypeBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render type badge with correct text', () => {
    renderWithI18n(<TypeBadge type={mockFireType} />);

    expect(screen.getByText('Fire')).toBeInTheDocument();
  });

  it('should have correct role and aria-label', () => {
    renderWithI18n(<TypeBadge type={mockFireType} />);

    const badge = screen.getByRole('badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('aria-label', 'Pokemon type: Fire');
  });

  it('should have correct title attribute', () => {
    renderWithI18n(<TypeBadge type={mockFireType} />);

    const badge = screen.getByRole('badge');
    expect(badge).toHaveAttribute('title', 'Fire');
  });

  it('should apply small size classes', () => {
    renderWithI18n(<TypeBadge type={mockFireType} size="sm" />);

    const badge = screen.getByRole('badge');
    expect(badge).toHaveClass('px-2', 'py-1', 'text-xs');
  });

  it('should apply medium size classes (default)', () => {
    renderWithI18n(<TypeBadge type={mockFireType} />);

    const badge = screen.getByRole('badge');
    expect(badge).toHaveClass('px-3', 'py-1.5', 'text-sm');
  });

  it('should apply large size classes', () => {
    renderWithI18n(<TypeBadge type={mockFireType} size="lg" />);

    const badge = screen.getByRole('badge');
    expect(badge).toHaveClass('px-4', 'py-2', 'text-base');
  });

  it('should have filled variant styles by default', () => {
    renderWithI18n(<TypeBadge type={mockFireType} />);

    const badge = screen.getByRole('badge');
    expect(badge).toHaveStyle({
      backgroundColor: '#F08030',
      color: '#FFFFFF'
    });
  });

  it('should have outlined variant styles', () => {
    renderWithI18n(<TypeBadge type={mockFireType} variant="outlined" />);

    const badge = screen.getByRole('badge');
    expect(badge).toHaveStyle({
      backgroundColor: 'transparent',
      color: '#F08030'
    });
  });

  it('should apply custom className', () => {
    renderWithI18n(<TypeBadge type={mockFireType} className="custom-class" />);

    const badge = screen.getByRole('badge');
    expect(badge).toHaveClass('custom-class');
  });

  it('should have hover and transition classes', () => {
    renderWithI18n(<TypeBadge type={mockFireType} />);

    const badge = screen.getByRole('badge');
    expect(badge).toHaveClass(
      'transition-all',
      'duration-200',
      'ease-in-out',
      'transform',
      'hover:scale-105',
      'shadow-sm',
      'hover:shadow-md'
    );
  });

  it('should handle different type names correctly', () => {
    renderWithI18n(<TypeBadge type={mockWaterType} />);

    expect(screen.getByText('Water')).toBeInTheDocument();
    
    const badge = screen.getByRole('badge');
    expect(badge).toHaveStyle({
      backgroundColor: '#6890F0'
    });
  });

  it('should be accessible with proper semantic markup', () => {
    renderWithI18n(<TypeBadge type={mockFireType} />);

    const badge = screen.getByRole('badge');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveAttribute('role', 'badge');
    expect(badge).toHaveAttribute('aria-label');
    expect(badge).toHaveAttribute('title');
  });
});