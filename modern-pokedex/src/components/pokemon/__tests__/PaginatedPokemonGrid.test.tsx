import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { PaginatedPokemonGrid } from '../PaginatedPokemonGrid';
import type { Pokemon } from '../../../types/pokemon';

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

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true
});

const renderWithI18n = (component: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  );
};

// Generate mock Pokemon data
const generateMockPokemon = (count: number): Pokemon[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    dexNumber: `#${String(index + 1).padStart(4, '0')}`,
    name: `Pokemon${index + 1}`,
    imageUrl: `https://example.com/pokemon${index + 1}.png`,
    types: [{ name: 'normal', color: '#A8A878' }],
    abilities: [{ name: 'Ability', isHidden: false }],
    eggGroups: ['Field'],
    isLegendary: false,
    bio: `Pokemon ${index + 1} description`,
    stats: { hp: 50, attack: 50, defense: 50, spAttack: 50, spDefense: 50, speed: 50, total: 300 }
  }));
};

describe('PaginatedPokemonGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render first page of Pokemon', () => {
    const pokemon = generateMockPokemon(25);
    renderWithI18n(
      <PaginatedPokemonGrid 
        pokemon={pokemon} 
        itemsPerPage={10}
        currentPage={1}
      />
    );

    // Should show first 10 Pokemon
    expect(screen.getByText('Pokemon1')).toBeInTheDocument();
    expect(screen.getByText('Pokemon10')).toBeInTheDocument();
    expect(screen.queryByText('Pokemon11')).not.toBeInTheDocument();
  });

  it('should render pagination when there are multiple pages', () => {
    const pokemon = generateMockPokemon(25);
    renderWithI18n(
      <PaginatedPokemonGrid 
        pokemon={pokemon} 
        itemsPerPage={10}
        currentPage={1}
      />
    );

    // Should show pagination
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 3')).toBeInTheDocument();
  });

  it('should not render pagination when there is only one page', () => {
    const pokemon = generateMockPokemon(5);
    renderWithI18n(
      <PaginatedPokemonGrid 
        pokemon={pokemon} 
        itemsPerPage={10}
        currentPage={1}
      />
    );

    // Should not show pagination
    expect(screen.queryByLabelText('Previous page')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next page')).not.toBeInTheDocument();
  });

  it('should call onPageChange when page button is clicked', () => {
    const onPageChange = vi.fn();
    const pokemon = generateMockPokemon(25);
    
    renderWithI18n(
      <PaginatedPokemonGrid 
        pokemon={pokemon} 
        itemsPerPage={10}
        currentPage={1}
        onPageChange={onPageChange}
      />
    );

    const page2Button = screen.getByLabelText('Page 2');
    fireEvent.click(page2Button);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when next button is clicked', () => {
    const onPageChange = vi.fn();
    const pokemon = generateMockPokemon(25);
    
    renderWithI18n(
      <PaginatedPokemonGrid 
        pokemon={pokemon} 
        itemsPerPage={10}
        currentPage={1}
        onPageChange={onPageChange}
      />
    );

    const nextButton = screen.getByLabelText('Next page');
    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when previous button is clicked', () => {
    const onPageChange = vi.fn();
    const pokemon = generateMockPokemon(25);
    
    renderWithI18n(
      <PaginatedPokemonGrid 
        pokemon={pokemon} 
        itemsPerPage={10}
        currentPage={2}
        onPageChange={onPageChange}
      />
    );

    const prevButton = screen.getByLabelText('Previous page');
    fireEvent.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('should disable previous button on first page', () => {
    const pokemon = generateMockPokemon(25);
    renderWithI18n(
      <PaginatedPokemonGrid 
        pokemon={pokemon} 
        itemsPerPage={10}
        currentPage={1}
      />
    );

    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    const pokemon = generateMockPokemon(25);
    renderWithI18n(
      <PaginatedPokemonGrid 
        pokemon={pokemon} 
        itemsPerPage={10}
        currentPage={3}
      />
    );

    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).toBeDisabled();
  });

  it('should highlight current page', () => {
    const pokemon = generateMockPokemon(25);
    renderWithI18n(
      <PaginatedPokemonGrid 
        pokemon={pokemon} 
        itemsPerPage={10}
        currentPage={2}
      />
    );

    const currentPageButton = screen.getByLabelText('Page 2');
    expect(currentPageButton).toHaveClass('bg-blue-600', 'text-white');
    expect(currentPageButton).toHaveAttribute('aria-current', 'page');
  });

  it('should show results info', () => {
    const pokemon = generateMockPokemon(25);
    renderWithI18n(
      <PaginatedPokemonGrid 
        pokemon={pokemon} 
        itemsPerPage={10}
        currentPage={2}
      />
    );

    expect(screen.getByText('Showing 11-20 of 25 Pokémon')).toBeInTheDocument();
  });

  it('should show dots for large page ranges', () => {
    const pokemon = generateMockPokemon(100);
    renderWithI18n(
      <PaginatedPokemonGrid 
        pokemon={pokemon} 
        itemsPerPage={10}
        currentPage={5}
      />
    );

    const dots = screen.getAllByText('...');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('should scroll to top when page changes', () => {
    const onPageChange = vi.fn((page) => {
      // Simulate page change
    });
    const pokemon = generateMockPokemon(25);
    
    renderWithI18n(
      <PaginatedPokemonGrid 
        pokemon={pokemon} 
        itemsPerPage={10}
        currentPage={1}
        onPageChange={onPageChange}
      />
    );

    const page2Button = screen.getByLabelText('Page 2');
    fireEvent.click(page2Button);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('should pass props to PokemonGrid', () => {
    const onPokemonClick = vi.fn();
    const pokemon = generateMockPokemon(5);
    
    renderWithI18n(
      <PaginatedPokemonGrid 
        pokemon={pokemon} 
        onPokemonClick={onPokemonClick}
        cardSize="lg"
        showStats
      />
    );

    // Should show stats (passed to PokemonGrid)
    expect(screen.getByText('HP')).toBeInTheDocument();
    
    // Should handle click (passed to PokemonGrid)
    const pokemonCard = screen.getByText('Pokemon1').closest('[role="button"]');
    fireEvent.click(pokemonCard!);
    expect(onPokemonClick).toHaveBeenCalledWith(pokemon[0]);
  });

  it('should handle loading state', () => {
    const pokemon = generateMockPokemon(5);
    renderWithI18n(
      <PaginatedPokemonGrid 
        pokemon={pokemon} 
        loading
      />
    );

    // Should show loading skeletons
    const skeletons = screen.getAllByRole('generic').filter(el => 
      el.classList.contains('animate-pulse')
    );
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should handle error state', () => {
    const pokemon = generateMockPokemon(5);
    renderWithI18n(
      <PaginatedPokemonGrid 
        pokemon={pokemon} 
        error="Failed to load"
      />
    );

    expect(screen.getByText('Failed to load Pokémon data')).toBeInTheDocument();
  });

  it('should handle empty state', () => {
    renderWithI18n(<PaginatedPokemonGrid pokemon={[]} />);

    expect(screen.getByText('No Pokémon found')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const pokemon = generateMockPokemon(5);
    const { container } = renderWithI18n(
      <PaginatedPokemonGrid 
        pokemon={pokemon} 
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should handle last page with fewer items', () => {
    const pokemon = generateMockPokemon(25);
    renderWithI18n(
      <PaginatedPokemonGrid 
        pokemon={pokemon} 
        itemsPerPage={10}
        currentPage={3}
      />
    );

    // Last page should show items 21-25
    expect(screen.getByText('Showing 21-25 of 25 Pokémon')).toBeInTheDocument();
    expect(screen.getByText('Pokemon21')).toBeInTheDocument();
    expect(screen.getByText('Pokemon25')).toBeInTheDocument();
  });
});