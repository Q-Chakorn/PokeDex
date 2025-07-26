import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock the PokemonService with more comprehensive data
const mockPokemon = [
  {
    id: 1,
    name: 'bulbasaur',
    image: 'bulbasaur.png',
    types: [{ name: 'grass', color: '#78C850' }, { name: 'poison', color: '#A040A0' }],
    height: 7,
    weight: 69,
    abilities: [{ name: 'overgrow', isHidden: false }],
    stats: { hp: 45, attack: 49, defense: 49, specialAttack: 65, specialDefense: 65, speed: 45, total: 318 },
    description: 'A strange seed was planted on its back at birth.'
  },
  {
    id: 4,
    name: 'charmander',
    image: 'charmander.png',
    types: [{ name: 'fire', color: '#F08030' }],
    height: 6,
    weight: 85,
    abilities: [{ name: 'blaze', isHidden: false }],
    stats: { hp: 39, attack: 52, defense: 43, specialAttack: 60, specialDefense: 50, speed: 65, total: 309 },
    description: 'Obviously prefers hot places.'
  },
  {
    id: 7,
    name: 'squirtle',
    image: 'squirtle.png',
    types: [{ name: 'water', color: '#6890F0' }],
    height: 5,
    weight: 90,
    abilities: [{ name: 'torrent', isHidden: false }],
    stats: { hp: 44, attack: 48, defense: 65, specialAttack: 50, specialDefense: 64, speed: 43, total: 314 },
    description: 'After birth, its back swells and hardens into a shell.'
  }
];

const mockTypes = [
  { name: 'grass', color: '#78C850' },
  { name: 'poison', color: '#A040A0' },
  { name: 'fire', color: '#F08030' },
  { name: 'water', color: '#6890F0' }
];

vi.mock('../services/PokemonService', () => ({
  PokemonService: vi.fn().mockImplementation(() => ({
    loadPokemon: vi.fn().mockResolvedValue(mockPokemon),
    getAvailableTypes: vi.fn().mockResolvedValue(mockTypes),
    getPokemonById: vi.fn().mockImplementation((id) => {
      const pokemon = mockPokemon.find(p => p.id === id);
      return Promise.resolve(pokemon || null);
    }),
    searchPokemon: vi.fn().mockImplementation((query) => {
      return Promise.resolve(
        mockPokemon.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.id.toString().includes(query)
        )
      );
    }),
    filterByTypes: vi.fn().mockImplementation((types) => {
      return Promise.resolve(
        mockPokemon.filter(p =>
          types.some(type =>
            p.types.some(pokemonType => pokemonType.name === type.name)
          )
        )
      );
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

describe('App Integration Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'theme') return 'light';
      if (key === 'language') return 'en';
      return null;
    });
    
    // Reset window location
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

  it('should complete full user journey from home to pokemon detail', async () => {
    render(<App />);

    // Should start on home page
    await waitFor(() => {
      expect(screen.getByText('Modern Pokédex')).toBeInTheDocument();
    });

    // Click "Explore Pokémon" button
    const exploreButton = screen.getByText('Explore Pokémon');
    await user.click(exploreButton);

    // Should navigate to pokemon list
    await waitFor(() => {
      expect(screen.getByText('Pokédex')).toBeInTheDocument();
    });

    // Should load and display pokemon
    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('charmander')).toBeInTheDocument();
      expect(screen.getByText('squirtle')).toBeInTheDocument();
    });

    // Click on a pokemon card
    const bulbasaurCard = screen.getByText('bulbasaur');
    await user.click(bulbasaurCard);

    // Should navigate to pokemon detail
    await waitFor(() => {
      expect(screen.getByText('A strange seed was planted on its back at birth.')).toBeInTheDocument();
    });

    // Should show back button
    const backButton = screen.getByText('Back to Pokémon list');
    expect(backButton).toBeInTheDocument();

    // Click back button
    await user.click(backButton);

    // Should return to pokemon list
    await waitFor(() => {
      expect(screen.getByText('Pokédex')).toBeInTheDocument();
    });
  });

  it('should handle search functionality end-to-end', async () => {
    render(<App />);

    // Navigate to pokemon list
    const exploreButton = await screen.findByText('Explore Pokémon');
    await user.click(exploreButton);

    // Wait for pokemon to load
    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    // Search for specific pokemon
    const searchInput = screen.getByPlaceholderText('Search Pokémon...');
    await user.type(searchInput, 'char');

    // Should filter results
    await waitFor(() => {
      expect(screen.getByText('charmander')).toBeInTheDocument();
      expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
      expect(screen.queryByText('squirtle')).not.toBeInTheDocument();
    });

    // Clear search
    await user.clear(searchInput);

    // Should show all pokemon again
    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('charmander')).toBeInTheDocument();
      expect(screen.getByText('squirtle')).toBeInTheDocument();
    });
  });

  it('should handle type filtering end-to-end', async () => {
    render(<App />);

    // Navigate to pokemon list
    const exploreButton = await screen.findByText('Explore Pokémon');
    await user.click(exploreButton);

    // Wait for pokemon to load
    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    // Open type filter
    const typeFilter = screen.getByText('Type');
    await user.click(typeFilter);

    // Select fire type
    await waitFor(() => {
      const fireOption = screen.getByText('Fire');
      await user.click(fireOption);
    });

    // Should filter to fire types only
    await waitFor(() => {
      expect(screen.getByText('charmander')).toBeInTheDocument();
      expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
      expect(screen.queryByText('squirtle')).not.toBeInTheDocument();
    });

    // Clear filters
    const clearButton = screen.getByText('Clear all filters');
    await user.click(clearButton);

    // Should show all pokemon again
    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('charmander')).toBeInTheDocument();
      expect(screen.getByText('squirtle')).toBeInTheDocument();
    });
  });

  it('should handle theme switching', async () => {
    render(<App />);

    // Should start with light theme
    await waitFor(() => {
      expect(document.documentElement).not.toHaveClass('dark');
    });

    // Find and click theme toggle
    const themeToggle = screen.getByLabelText('Toggle theme');
    await user.click(themeToggle);

    // Should switch to dark theme
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark');
    });

    // Should persist theme preference
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should handle language switching', async () => {
    render(<App />);

    // Should start with English
    await waitFor(() => {
      expect(screen.getByText('Modern Pokédex')).toBeInTheDocument();
    });

    // Find and click language selector
    const languageSelector = screen.getByLabelText('Select language');
    await user.click(languageSelector);

    // Select Thai
    const thaiOption = screen.getByText('ไทย');
    await user.click(thaiOption);

    // Should switch to Thai
    await waitFor(() => {
      expect(screen.getByText('โมเดิร์น โปเกเด็กซ์')).toBeInTheDocument();
    });

    // Should persist language preference
    expect(localStorageMock.setItem).toHaveBeenCalledWith('language', 'th');
  });

  it('should handle error states gracefully', async () => {
    // Mock service to throw error
    vi.mocked(require('../services/PokemonService').PokemonService).mockImplementation(() => ({
      loadPokemon: vi.fn().mockRejectedValue(new Error('Network error')),
      getAvailableTypes: vi.fn().mockRejectedValue(new Error('Network error')),
      getPokemonById: vi.fn().mockRejectedValue(new Error('Network error'))
    }));

    render(<App />);

    // Navigate to pokemon list
    const exploreButton = await screen.findByText('Explore Pokémon');
    await user.click(exploreButton);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    // Should show retry button
    const retryButton = screen.getByText('Try again');
    expect(retryButton).toBeInTheDocument();
  });

  it('should handle no results state', async () => {
    render(<App />);

    // Navigate to pokemon list
    const exploreButton = await screen.findByText('Explore Pokémon');
    await user.click(exploreButton);

    // Wait for pokemon to load
    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    // Search for non-existent pokemon
    const searchInput = screen.getByPlaceholderText('Search Pokémon...');
    await user.type(searchInput, 'nonexistent');

    // Should show no results
    await waitFor(() => {
      expect(screen.getByText('No results for "nonexistent"')).toBeInTheDocument();
    });

    // Should show suggestions
    expect(screen.getByText('Try these suggestions:')).toBeInTheDocument();
  });

  it('should handle responsive design', async () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Modern Pokédex')).toBeInTheDocument();
    });

    // Should be responsive (this is a basic check)
    expect(document.body).toBeInTheDocument();
  });

  it('should maintain state during navigation', async () => {
    render(<App />);

    // Navigate to pokemon list
    const exploreButton = await screen.findByText('Explore Pokémon');
    await user.click(exploreButton);

    // Apply search filter
    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search Pokémon...');
    await user.type(searchInput, 'char');

    // Should filter results
    await waitFor(() => {
      expect(screen.getByText('charmander')).toBeInTheDocument();
    });

    // Navigate to detail
    const charmanderCard = screen.getByText('charmander');
    await user.click(charmanderCard);

    // Navigate back
    await waitFor(() => {
      const backButton = screen.getByText('Back to Pokémon list');
      await user.click(backButton);
    });

    // Should maintain search state
    await waitFor(() => {
      expect(screen.getByDisplayValue('char')).toBeInTheDocument();
      expect(screen.getByText('charmander')).toBeInTheDocument();
    });
  });
});