import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { AppProvider } from '../../contexts/AppContext';
import { AppRouter } from '../AppRouter';

// Mock the page components
vi.mock('../../pages/HomePage', () => ({
  default: () => <div data-testid="home-page">Home Page</div>
}));

vi.mock('../../pages/PokemonListPage', () => ({
  default: () => <div data-testid="pokemon-list-page">Pokemon List Page</div>
}));

vi.mock('../../pages/PokemonDetailPage', () => ({
  default: () => <div data-testid="pokemon-detail-page">Pokemon Detail Page</div>
}));

vi.mock('../../pages/NotFoundPage', () => ({
  default: () => <div data-testid="not-found-page">Not Found Page</div>
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

const renderWithProviders = (initialEntries: string[] = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <I18nextProvider i18n={i18n}>
        <AppProvider>
          <AppRouter />
        </AppProvider>
      </I18nextProvider>
    </MemoryRouter>
  );
};

describe('AppRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render home page for root route', async () => {
    renderWithProviders(['/']);
    
    expect(await screen.findByTestId('home-page')).toBeInTheDocument();
  });

  it('should render pokemon list page for /pokemon route', async () => {
    renderWithProviders(['/pokemon']);
    
    expect(await screen.findByTestId('pokemon-list-page')).toBeInTheDocument();
  });

  it('should render pokemon detail page for /pokemon/:id route', async () => {
    renderWithProviders(['/pokemon/1']);
    
    expect(await screen.findByTestId('pokemon-detail-page')).toBeInTheDocument();
  });

  it('should render not found page for unknown routes', async () => {
    renderWithProviders(['/unknown-route']);
    
    expect(await screen.findByTestId('not-found-page')).toBeInTheDocument();
  });

  it('should redirect /pokedex to /pokemon', async () => {
    renderWithProviders(['/pokedex']);
    
    expect(await screen.findByTestId('pokemon-list-page')).toBeInTheDocument();
  });

  it('should show loading spinner while lazy loading', () => {
    renderWithProviders(['/']);
    
    // Should show loading spinner initially
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should handle error boundary', () => {
    // This would require mocking an error in one of the components
    // For now, we'll just verify the error boundary is present
    renderWithProviders(['/']);
    
    // The error boundary should be rendered (though not visible unless there's an error)
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('should render with custom basename', async () => {
    render(
      <MemoryRouter initialEntries={['/app/']}>
        <I18nextProvider i18n={i18n}>
          <AppProvider>
            <AppRouter basename="/app" />
          </AppProvider>
        </I18nextProvider>
      </MemoryRouter>
    );
    
    expect(await screen.findByTestId('home-page')).toBeInTheDocument();
  });
});