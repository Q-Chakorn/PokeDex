import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { AppLayout } from '../AppLayout';

// Mock the child components
vi.mock('../Header', () => ({
  Header: () => <div data-testid="header">Header</div>
}));

vi.mock('../Footer', () => ({
  Footer: () => <div data-testid="footer">Footer</div>
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

const renderWithI18n = (children: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
};

describe('AppLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render header, main content, and footer', () => {
    renderWithI18n(
      <AppLayout>
        <div data-testid="main-content">Main Content</div>
      </AppLayout>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should have proper layout structure', () => {
    renderWithI18n(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const layout = screen.getByTestId('header').parentElement;
    expect(layout).toHaveClass('min-h-screen', 'flex', 'flex-col');
  });

  it('should render children in main element', () => {
    renderWithI18n(
      <AppLayout>
        <div data-testid="child-content">Child Content</div>
      </AppLayout>
    );

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should have responsive container classes', () => {
    renderWithI18n(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('container', 'mx-auto', 'px-4', 'py-6', 'max-w-7xl');
  });

  it('should have dark mode support classes', () => {
    renderWithI18n(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const layout = screen.getByTestId('header').parentElement;
    expect(layout).toHaveClass('bg-gray-50', 'dark:bg-gray-900');
  });
});