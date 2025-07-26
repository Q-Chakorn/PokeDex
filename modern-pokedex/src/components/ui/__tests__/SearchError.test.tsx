import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { SearchError } from '../SearchError';

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

describe('SearchError', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render general error message', () => {
    const error = new Error('Something went wrong');
    
    renderWithI18n(<SearchError error={error} />);

    expect(screen.getByText('Search Error')).toBeInTheDocument();
    expect(screen.getByText('We encountered an error while searching for Pokémon. Please try again.')).toBeInTheDocument();
  });

  it('should render network error message', () => {
    const error = new Error('Network error occurred');
    
    renderWithI18n(<SearchError error={error} />);

    expect(screen.getByText('Connection Error')).toBeInTheDocument();
    expect(screen.getByText('Unable to connect to the server. Please check your internet connection and try again.')).toBeInTheDocument();
  });

  it('should render timeout error message', () => {
    const error = new Error('Request timeout');
    
    renderWithI18n(<SearchError error={error} />);

    expect(screen.getByText('Request Timeout')).toBeInTheDocument();
    expect(screen.getByText('The search request took too long to complete. Please try again.')).toBeInTheDocument();
  });

  it('should handle string error', () => {
    const error = 'String error message';
    
    renderWithI18n(<SearchError error={error} />);

    expect(screen.getByText('Search Error')).toBeInTheDocument();
    expect(screen.getByText('We encountered an error while searching for Pokémon. Please try again.')).toBeInTheDocument();
  });

  it('should show retry button by default', () => {
    const onRetry = vi.fn();
    const error = new Error('Test error');
    
    renderWithI18n(<SearchError error={error} onRetry={onRetry} />);

    const retryButton = screen.getByText('Try Again');
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalled();
  });

  it('should hide retry button when showRetryButton is false', () => {
    const onRetry = vi.fn();
    const error = new Error('Test error');
    
    renderWithI18n(
      <SearchError 
        error={error} 
        onRetry={onRetry} 
        showRetryButton={false}
      />
    );

    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('should show clear filters button when enabled', () => {
    const onClearFilters = vi.fn();
    const error = new Error('Test error');
    
    renderWithI18n(
      <SearchError 
        error={error} 
        onClearFilters={onClearFilters}
        showClearFiltersButton={true}
      />
    );

    const clearFiltersButton = screen.getByText('Clear Filters');
    expect(clearFiltersButton).toBeInTheDocument();
    
    fireEvent.click(clearFiltersButton);
    expect(onClearFilters).toHaveBeenCalled();
  });

  it('should not show clear filters button by default', () => {
    const onClearFilters = vi.fn();
    const error = new Error('Test error');
    
    renderWithI18n(
      <SearchError 
        error={error} 
        onClearFilters={onClearFilters}
      />
    );

    expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const error = new Error('Test error');
    const { container } = renderWithI18n(
      <SearchError error={error} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should show help text', () => {
    const error = new Error('Test error');
    
    renderWithI18n(<SearchError error={error} />);

    expect(screen.getByText('If the problem persists, please refresh the page or contact support.')).toBeInTheDocument();
  });

  it('should render error icon', () => {
    const error = new Error('Test error');
    
    renderWithI18n(<SearchError error={error} />);

    // Check for SVG element with warning/error icon
    const errorIcon = screen.getByRole('img', { hidden: true });
    expect(errorIcon).toBeInTheDocument();
  });

  it('should not show retry button when onRetry is not provided', () => {
    const error = new Error('Test error');
    
    renderWithI18n(<SearchError error={error} />);

    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('should handle fetch error correctly', () => {
    const error = new Error('Failed to fetch data');
    
    renderWithI18n(<SearchError error={error} />);

    expect(screen.getByText('Connection Error')).toBeInTheDocument();
    expect(screen.getByText('Unable to connect to the server. Please check your internet connection and try again.')).toBeInTheDocument();
  });

  it('should show both buttons when both callbacks are provided and enabled', () => {
    const onRetry = vi.fn();
    const onClearFilters = vi.fn();
    const error = new Error('Test error');
    
    renderWithI18n(
      <SearchError 
        error={error} 
        onRetry={onRetry}
        onClearFilters={onClearFilters}
        showRetryButton={true}
        showClearFiltersButton={true}
      />
    );

    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
  });

  // Note: Error details test would only work in development environment
  // This test would need to be adjusted based on how NODE_ENV is handled in tests
  it('should handle error message extraction correctly', () => {
    const errorWithMessage = new Error('Specific error message');
    const stringError = 'String error';
    
    // Test Error object
    renderWithI18n(<SearchError error={errorWithMessage} />);
    expect(screen.getByText('Search Error')).toBeInTheDocument();
    
    // Re-render with string error
    renderWithI18n(<SearchError error={stringError} />);
    expect(screen.getByText('Search Error')).toBeInTheDocument();
  });
});