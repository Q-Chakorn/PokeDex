import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { PokemonGrid } from '../PokemonGrid';
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

const renderWithI18n = (component: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  );
};

const mockPokemon: Pokemon[] = [
  {
    id: 25,
    dexNumber: '#0025',
    name: 'Pikachu',
    imageUrl: 'https://example.com/pikachu.png',
    types: [{ name: 'electric', color: '#F8D030' }],
    abilities: [{ name: 'Static', isHidden: false }],
    eggGroups: ['Field', 'Fairy'],
    isLegendary: false,
    bio: 'Pikachu is an Electric-type Pokémon.',
    stats: { hp: 35, attack: 55, defense: 40, spAttack: 50, spDefense: 50, speed: 90, total: 320 }
  },
  {
    id: 1,
    dexNumber: '#0001',
    name: 'Bulbasaur',
    imageUrl: 'https://example.com/bulbasaur.png',
    types: [
      { name: 'grass', color: '#78C850' },
      { name: 'poison', color: '#A040A0' }
    ],
    abilities: [{ name: 'Overgrow', isHidden: false }],
    eggGroups: ['Monster', 'Grass'],
    isLegendary: false,
    bio: 'Bulbasaur is a dual-type Grass/Poison Pokémon.',
    stats: { hp: 45, attack: 49, defense: 49, spAttack: 65, spDefense: 65, speed: 45, total: 318 }
  }
];

describe('PokemonGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render Pokemon cards when data is provided', () => {
    renderWithI18n(<PokemonGrid pokemon={mockPokemon} />);

    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
  });

  it('should render loading skeletons when loading is true', () => {
    renderWithI18n(<PokemonGrid pokemon={[]} loading />);

    // Should render default 12 skeletons
    const skeletons = screen.getAllByRole('generic').filter(el => 
      el.classList.contains('animate-pulse')
    );
    expect(skeletons).toHaveLength(12);
  });

  it('should render custom number of skeletons', () => {
    renderWithI18n(<PokemonGrid pokemon={[]} loading skeletonCount={6} />);

    const skeletons = screen.getAllByRole('generic').filter(el => 
      el.classList.contains('animate-pulse')
    );
    expect(skeletons).toHaveLength(6);
  });

  it('should render error message when error is provided', () => {
    const errorMessage = 'Failed to load Pokemon';
    renderWithI18n(<PokemonGrid pokemon={[]} error={errorMessage} />);

    expect(screen.getByText('Failed to load Pokémon data')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should render empty state when no Pokemon and not loading', () => {
    renderWithI18n(<PokemonGrid pokemon={[]} />);

    expect(screen.getByText('No Pokémon found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search terms or filters')).toBeInTheDocument();
  });

  it('should call onPokemonClick when Pokemon card is clicked', () => {
    const onPokemonClick = vi.fn();
    renderWithI18n(<PokemonGrid pokemon={mockPokemon} onPokemonClick={onPokemonClick} />);

    const pikachuCard = screen.getByText('Pikachu').closest('[role="button"]');
    expect(pikachuCard).toBeInTheDocument();
    
    fireEvent.click(pikachuCard!);
    expect(onPokemonClick).toHaveBeenCalledWith(mockPokemon[0]);
  });

  it('should call onRetry when retry button is clicked in error state', () => {
    const onRetry = vi.fn();
    renderWithI18n(<PokemonGrid pokemon={[]} error="Error message" onRetry={onRetry} />);

    const retryButton = screen.getByText('Try again');
    fireEvent.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should call onClearFilters when clear filters button is clicked in empty state', () => {
    const onClearFilters = vi.fn();
    renderWithI18n(<PokemonGrid pokemon={[]} onClearFilters={onClearFilters} />);

    const clearButton = screen.getByText('Clear all filters');
    fireEvent.click(clearButton);
    
    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });

  it('should apply custom className', () => {
    const { container } = renderWithI18n(
      <PokemonGrid pokemon={mockPokemon} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should pass cardSize to Pokemon cards', () => {
    renderWithI18n(<PokemonGrid pokemon={mockPokemon} cardSize="lg" onPokemonClick={vi.fn()} />);

    const card = screen.getByText('Pikachu').closest('[role="button"]');
    const cardContent = card?.querySelector('.p-6');
    expect(cardContent).toBeInTheDocument();
  });

  it('should pass showStats to Pokemon cards', () => {
    renderWithI18n(<PokemonGrid pokemon={mockPokemon} showStats />);

    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('Attack')).toBeInTheDocument();
    expect(screen.getByText('Defense')).toBeInTheDocument();
  });

  it('should render loading more indicator when loading with existing Pokemon', () => {
    renderWithI18n(<PokemonGrid pokemon={mockPokemon} loading />);

    expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument();
    expect(screen.getByText('Pikachu')).toBeInTheDocument(); // Existing Pokemon still shown
  });

  it('should have responsive grid classes', () => {
    const { container } = renderWithI18n(<PokemonGrid pokemon={mockPokemon} />);

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4');
  });

  it('should apply custom column configuration', () => {
    const customColumns = { sm: 2, md: 3, lg: 4, xl: 5 };
    const { container } = renderWithI18n(
      <PokemonGrid pokemon={mockPokemon} columns={customColumns} />
    );

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4', 'xl:grid-cols-5');
  });

  it('should not render error when loading is true', () => {
    renderWithI18n(<PokemonGrid pokemon={[]} error="Error message" loading />);

    expect(screen.queryByText('Failed to load Pokémon data')).not.toBeInTheDocument();
    // Should show skeletons instead
    const skeletons = screen.getAllByRole('generic').filter(el => 
      el.classList.contains('animate-pulse')
    );
    expect(skeletons.length).toBeGreaterThan(0);
  });
});