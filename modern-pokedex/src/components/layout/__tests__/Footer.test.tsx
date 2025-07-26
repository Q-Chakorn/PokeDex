import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { Footer } from '../Footer';

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

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render footer with copyright', () => {
    renderWithI18n(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} Modern Pokédex. All rights reserved.`)).toBeInTheDocument();
  });

  it('should render footer links', () => {
    renderWithI18n(<Footer />);

    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('should render PokéAPI attribution', () => {
    renderWithI18n(<Footer />);

    expect(screen.getByText('Powered by')).toBeInTheDocument();
    
    const pokeApiLink = screen.getByRole('link', { name: 'PokéAPI' });
    expect(pokeApiLink).toBeInTheDocument();
    expect(pokeApiLink).toHaveAttribute('href', 'https://pokeapi.co/');
    expect(pokeApiLink).toHaveAttribute('target', '_blank');
    expect(pokeApiLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render disclaimer text', () => {
    renderWithI18n(<Footer />);

    expect(screen.getByText(/Pokémon and Pokémon character names are trademarks of Nintendo/)).toBeInTheDocument();
    expect(screen.getByText(/This is a fan-made project and is not affiliated with Nintendo/)).toBeInTheDocument();
  });

  it('should have proper footer structure', () => {
    renderWithI18n(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('bg-white', 'dark:bg-gray-800');
  });

  it('should have responsive layout classes', () => {
    renderWithI18n(<Footer />);

    const footer = screen.getByRole('contentinfo');
    const container = footer.querySelector('.container');
    expect(container).toHaveClass('mx-auto', 'px-4', 'py-6', 'max-w-7xl');
  });

  it('should have dark mode support', () => {
    renderWithI18n(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('bg-white', 'dark:bg-gray-800', 'border-t', 'border-gray-200', 'dark:border-gray-700');
  });

  it('should have proper link styling', () => {
    renderWithI18n(<Footer />);

    const privacyLink = screen.getByText('Privacy Policy');
    expect(privacyLink).toHaveClass('text-sm', 'text-gray-600', 'dark:text-gray-400');
  });

  it('should have responsive flex layout', () => {
    renderWithI18n(<Footer />);

    const mainContent = screen.getByText('Privacy Policy').closest('.flex');
    expect(mainContent).toHaveClass('flex', 'flex-col', 'md:flex-row', 'justify-between');
  });
});