import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { ErrorMessage } from '../ErrorMessage';

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

describe('ErrorMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render with default props', () => {
    renderWithI18n(<ErrorMessage />);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('bg-red-50', 'border-red-200');
  });

  it('should render with custom title and message', () => {
    const title = 'Custom Error Title';
    const message = 'Custom error message';

    renderWithI18n(<ErrorMessage title={title} message={message} />);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('should apply error variant classes (default)', () => {
    renderWithI18n(<ErrorMessage />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-red-50', 'border-red-200');
  });

  it('should apply warning variant classes', () => {
    renderWithI18n(<ErrorMessage variant="warning" />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-yellow-50', 'border-yellow-200');
  });

  it('should apply info variant classes', () => {
    renderWithI18n(<ErrorMessage variant="info" />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-blue-50', 'border-blue-200');
  });

  it('should apply small size classes', () => {
    renderWithI18n(<ErrorMessage size="sm" />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('p-3');
  });

  it('should apply medium size classes (default)', () => {
    renderWithI18n(<ErrorMessage />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('p-4');
  });

  it('should apply large size classes', () => {
    renderWithI18n(<ErrorMessage size="lg" />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('p-6');
  });

  it('should show icon by default', () => {
    renderWithI18n(<ErrorMessage />);

    const icon = screen.getByRole('alert').querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should hide icon when showIcon is false', () => {
    renderWithI18n(<ErrorMessage showIcon={false} />);

    const icon = screen.getByRole('alert').querySelector('svg');
    expect(icon).not.toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const onRetry = vi.fn();

    renderWithI18n(<ErrorMessage onRetry={onRetry} />);

    const retryButton = screen.getByText('Try again');
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should render dismiss button when onDismiss is provided', () => {
    const onDismiss = vi.fn();

    renderWithI18n(<ErrorMessage onDismiss={onDismiss} />);

    const dismissButton = screen.getByText('Dismiss');
    expect(dismissButton).toBeInTheDocument();

    fireEvent.click(dismissButton);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should render close button when onDismiss is provided', () => {
    const onDismiss = vi.fn();

    renderWithI18n(<ErrorMessage onDismiss={onDismiss} />);

    const closeButton = screen.getByRole('button', { name: 'Dismiss' });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should apply custom className', () => {
    renderWithI18n(<ErrorMessage className="custom-class" />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('custom-class');
  });

  it('should have proper role attribute', () => {
    renderWithI18n(<ErrorMessage />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('role', 'alert');
  });

  it('should render different icons for different variants', () => {
    const { rerender } = renderWithI18n(<ErrorMessage variant="error" />);
    let icon = screen.getByRole('alert').querySelector('svg');
    expect(icon).toBeInTheDocument();

    rerender(
      <I18nextProvider i18n={i18n}>
        <ErrorMessage variant="warning" />
      </I18nextProvider>
    );
    icon = screen.getByRole('alert').querySelector('svg');
    expect(icon).toBeInTheDocument();

    rerender(
      <I18nextProvider i18n={i18n}>
        <ErrorMessage variant="info" />
      </I18nextProvider>
    );
    icon = screen.getByRole('alert').querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should render both retry and dismiss buttons when both callbacks are provided', () => {
    const onRetry = vi.fn();
    const onDismiss = vi.fn();

    renderWithI18n(<ErrorMessage onRetry={onRetry} onDismiss={onDismiss} />);

    expect(screen.getByText('Try again')).toBeInTheDocument();
    expect(screen.getByText('Dismiss')).toBeInTheDocument();
  });

  it('should have proper button styling', () => {
    const onRetry = vi.fn();

    renderWithI18n(<ErrorMessage onRetry={onRetry} />);

    const retryButton = screen.getByText('Try again');
    expect(retryButton).toHaveClass('bg-red-600', 'hover:bg-red-700', 'text-white');
  });
});