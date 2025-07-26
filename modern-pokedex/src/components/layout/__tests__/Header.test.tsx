import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { Header } from '../Header';

// Mock the UI components
vi.mock('../../ui/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>
}));

vi.mock('../../ui/LanguageSelector', () => ({
  LanguageSelector: () => <div data-testid="language-selector">Language Selector</div>
}));

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

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render header with logo and title', async () => {
    renderWithI18n(<Header />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Modern Pokédex')).toBeInTheDocument();
    expect(screen.getByText('Discover and explore Pokémon from the Kanto region')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    renderWithI18n(<Header />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Pokémon')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('should render theme toggle and language selector', () => {
    renderWithI18n(<Header />);

    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
  });

  it('should have mobile menu button', () => {
    renderWithI18n(<Header />);

    const mobileMenuButton = screen.getByRole('button', { name: /open main menu/i });
    expect(mobileMenuButton).toBeInTheDocument();
    expect(mobileMenuButton).toHaveClass('md:hidden');
  });

  it('should have responsive navigation', () => {
    renderWithI18n(<Header />);

    const desktopNav = screen.getByRole('navigation');
    expect(desktopNav).toHaveClass('hidden', 'md:flex');
  });

  it('should have proper logo styling', () => {
    renderWithI18n(<Header />);

    const logoContainer = screen.getByText('Modern Pokédex').closest('div')?.previousElementSibling;
    expect(logoContainer?.firstElementChild).toHaveClass('w-10', 'h-10', 'bg-gradient-to-br');
  });

  it('should have dark mode support classes', () => {
    renderWithI18n(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-white', 'dark:bg-gray-800');
  });

  it('should have mobile navigation menu', () => {
    renderWithI18n(<Header />);

    const mobileNav = screen.getByRole('banner').querySelector('.md\\:hidden .space-y-1');
    expect(mobileNav).toBeInTheDocument();
  });
});