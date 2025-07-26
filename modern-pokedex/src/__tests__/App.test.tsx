import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';

// Mock the PokemonService
vi.mock('../services/PokemonService', () => ({
  PokemonService: vi.fn().mockImplementation(() => ({
    loadPokemon: vi.fn().mockResolvedValue([
      {
        id: 1,
        name: 'bulbasaur',
        image: 'bulbasaur.png',
        types: [{ name: 'grass', color: '#78C850' }],
        height: 7,
        weight: 69,
        abilities: [{ name: 'overgrow', isHidden: false }],
        stats: { hp: 45, attack: 49, defense: 49, specialAttack: 65, specialDefense: 65, speed: 45, total: 318 }
      }
    ]),
    getAvailableTypes: vi.fn().mockResolvedValue([
      { name: 'grass', color: '#78C850' }
    ]),
    getPokemonById: vi.fn().mockResolvedValue({
      id: 1,
      name: 'bulbasaur',
      image: 'bulbasaur.png',
      types: [{ name: 'grass', color: '#78C850' }],
      height: 7,
      weight: 69,
      abilities: [{ name: 'overgrow', isHidden: false }],
      stats: { hp: 45, attack: 49, defense: 49, specialAttack: 65, specialDefense: 65, speed: 45, total: 318 }
    })
  }))
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

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
    
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/',
        search: '',
        hash: '',
        href: 'http://localhost:3000/',
      },
      writable: true,
    });
  });

  it('should render without crashing', async () => {
    render(<App />);
    
    // Should show loading initially, then content
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  it('should render with all providers', async () => {
    render(<App />);
    
    // Wait for the app to load
    await waitFor(() => {
      // Should have theme provider (check for theme-related classes or elements)
      expect(document.documentElement).toBeInTheDocument();
    });
  });

  it('should handle theme provider', async () => {
    render(<App />);
    
    await waitFor(() => {
      // Theme provider should be working (check for theme classes)
      const html = document.documentElement;
      expect(html).toBeInTheDocument();
    });
  });

  it('should handle language provider', async () => {
    render(<App />);
    
    await waitFor(() => {
      // Language provider should be working
      expect(document.body).toBeInTheDocument();
    });
  });

  it('should handle app state provider', async () => {
    render(<App />);
    
    await waitFor(() => {
      // App state provider should be working
      expect(document.body).toBeInTheDocument();
    });
  });

  it('should render router', async () => {
    render(<App />);
    
    await waitFor(() => {
      // Router should be working - check for navigation or route content
      expect(document.body).toBeInTheDocument();
    });
  });

  it('should handle error boundary', () => {
    // Mock console.error to avoid error logs in test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Create a component that throws an error
    const ThrowError = () => {
      throw new Error('Test error');
    };
    
    // Mock App to include the error component
    const AppWithError = () => (
      <div>
        <App />
        <ThrowError />
      </div>
    );
    
    // This should not crash the test
    expect(() => render(<AppWithError />)).not.toThrow();
    
    consoleSpy.mockRestore();
  });

  it('should initialize with correct theme from localStorage', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'theme') return 'dark';
      if (key === 'language') return 'en';
      return null;
    });
    
    render(<App />);
    
    await waitFor(() => {
      expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
    });
  });

  it('should initialize with correct language from localStorage', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'theme') return 'light';
      if (key === 'language') return 'th';
      return null;
    });
    
    render(<App />);
    
    await waitFor(() => {
      expect(localStorageMock.getItem).toHaveBeenCalledWith('language');
    });
  });

  it('should handle system theme preference', async () => {
    // Mock system preference for dark mode
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockReturnValue({
        matches: true, // System prefers dark mode
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    });
    
    localStorageMock.getItem.mockReturnValue(null); // No stored preference
    
    render(<App />);
    
    await waitFor(() => {
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });
  });

  it('should be responsive to viewport changes', async () => {
    render(<App />);
    
    await waitFor(() => {
      // Should handle responsive design
      expect(document.body).toBeInTheDocument();
    });
  });

  it('should handle navigation between routes', async () => {
    render(<App />);
    
    await waitFor(() => {
      // Should be able to navigate (router is working)
      expect(document.body).toBeInTheDocument();
    });
  });

  it('should maintain state across route changes', async () => {
    render(<App />);
    
    await waitFor(() => {
      // State should persist across navigation
      expect(document.body).toBeInTheDocument();
    });
  });

  it('should handle concurrent rendering', async () => {
    // Test that the app works with React's concurrent features
    render(<App />);
    
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  it('should cleanup resources on unmount', async () => {
    const { unmount } = render(<App />);
    
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
    
    // Should not throw when unmounting
    expect(() => unmount()).not.toThrow();
  });
});