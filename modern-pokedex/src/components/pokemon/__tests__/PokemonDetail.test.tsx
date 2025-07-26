import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { PokemonDetail } from '../PokemonDetail';
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

const mockPokemon: Pokemon = {
  id: 25,
  name: 'pikachu',
  image: 'https://example.com/pikachu.png',
  types: [
    { name: 'electric', color: '#F8D030' }
  ],
  height: 4, // 0.4m
  weight: 60, // 6.0kg
  abilities: [
    { name: 'static', isHidden: false },
    { name: 'lightning-rod', isHidden: true }
  ],
  stats: {
    hp: 35,
    attack: 55,
    defense: 40,
    specialAttack: 50,
    specialDefense: 50,
    speed: 90,
    total: 320
  },
  description: 'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
  generation: 1
};

describe('PokemonDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render loading state', () => {
    renderWithI18n(<PokemonDetail loading={true} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render error state', () => {
    const error = new Error('Failed to load Pokemon');
    
    renderWithI18n(<PokemonDetail error={error} />);

    expect(screen.getByText('Failed to load Pokemon')).toBeInTheDocument();
  });

  it('should render not found state when no pokemon provided', () => {
    renderWithI18n(<PokemonDetail />);

    expect(screen.getByText('Pokémon not found')).toBeInTheDocument();
  });

  it('should render pokemon details correctly', () => {
    renderWithI18n(<PokemonDetail pokemon={mockPokemon} />);

    // Check name
    expect(screen.getByText('pikachu')).toBeInTheDocument();
    
    // Check number
    expect(screen.getByText('No. 025')).toBeInTheDocument();
    
    // Check type
    expect(screen.getByText('Electric')).toBeInTheDocument();
    
    // Check height and weight
    expect(screen.getByText('0.4 m')).toBeInTheDocument();
    expect(screen.getByText('6.0 kg')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText(mockPokemon.description!)).toBeInTheDocument();
  });

  it('should render abilities correctly', () => {
    renderWithI18n(<PokemonDetail pokemon={mockPokemon} />);

    expect(screen.getByText('Abilities')).toBeInTheDocument();
    expect(screen.getByText('static')).toBeInTheDocument();
    expect(screen.getByText('lightning-rod')).toBeInTheDocument();
    expect(screen.getByText('(Hidden)')).toBeInTheDocument();
  });

  it('should show back button when showBackButton is true', () => {
    const onBack = vi.fn();
    
    renderWithI18n(
      <PokemonDetail 
        pokemon={mockPokemon} 
        onBack={onBack}
        showBackButton={true}
      />
    );

    const backButton = screen.getByText('Back to Pokémon list');
    expect(backButton).toBeInTheDocument();
    
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalled();
  });

  it('should hide back button when showBackButton is false', () => {
    const onBack = vi.fn();
    
    renderWithI18n(
      <PokemonDetail 
        pokemon={mockPokemon} 
        onBack={onBack}
        showBackButton={false}
      />
    );

    expect(screen.queryByText('Back to Pokémon list')).not.toBeInTheDocument();
  });

  it('should not show back button when onBack is not provided', () => {
    renderWithI18n(<PokemonDetail pokemon={mockPokemon} />);

    expect(screen.queryByText('Back to Pokémon list')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = renderWithI18n(
      <PokemonDetail pokemon={mockPokemon} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should handle image error correctly', () => {
    renderWithI18n(<PokemonDetail pokemon={mockPokemon} />);

    const image = screen.getByAltText('pikachu');
    expect(image).toBeInTheDocument();
    
    // Simulate image error
    fireEvent.error(image);
    
    expect(image).toHaveAttribute('src', '/images/pokemon-placeholder.png');
  });

  it('should format height correctly', () => {
    const tallPokemon = { ...mockPokemon, height: 17 }; // 1.7m
    
    renderWithI18n(<PokemonDetail pokemon={tallPokemon} />);

    expect(screen.getByText('1.7 m')).toBeInTheDocument();
  });

  it('should format weight correctly', () => {
    const heavyPokemon = { ...mockPokemon, weight: 1250 }; // 125.0kg
    
    renderWithI18n(<PokemonDetail pokemon={heavyPokemon} />);

    expect(screen.getByText('125.0 kg')).toBeInTheDocument();
  });

  it('should render generation info when available', () => {
    renderWithI18n(<PokemonDetail pokemon={mockPokemon} />);

    expect(screen.getByText('Generation')).toBeInTheDocument();
    expect(screen.getByText('Generation 1')).toBeInTheDocument();
  });

  it('should not render generation info when not available', () => {
    const pokemonWithoutGeneration = { ...mockPokemon };
    delete pokemonWithoutGeneration.generation;
    
    renderWithI18n(<PokemonDetail pokemon={pokemonWithoutGeneration} />);

    expect(screen.queryByText('Generation')).not.toBeInTheDocument();
  });

  it('should not render description when not available', () => {
    const pokemonWithoutDescription = { ...mockPokemon };
    delete pokemonWithoutDescription.description;
    
    renderWithI18n(<PokemonDetail pokemon={pokemonWithoutDescription} />);

    expect(screen.queryByText('Description')).not.toBeInTheDocument();
  });

  it('should not render abilities when not available', () => {
    const pokemonWithoutAbilities = { ...mockPokemon, abilities: [] };
    
    renderWithI18n(<PokemonDetail pokemon={pokemonWithoutAbilities} />);

    expect(screen.queryByText('Abilities')).not.toBeInTheDocument();
  });

  it('should handle pokemon with multiple types', () => {
    const multiTypePokemon = {
      ...mockPokemon,
      types: [
        { name: 'electric', color: '#F8D030' },
        { name: 'flying', color: '#A890F0' }
      ]
    };
    
    renderWithI18n(<PokemonDetail pokemon={multiTypePokemon} />);

    expect(screen.getByText('Electric')).toBeInTheDocument();
    expect(screen.getByText('Flying')).toBeInTheDocument();
  });

  it('should show retry button in error state when onBack is provided', () => {
    const onBack = vi.fn();
    const error = new Error('Test error');
    
    renderWithI18n(<PokemonDetail error={error} onBack={onBack} />);

    const retryButton = screen.getByText('Try again');
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(onBack).toHaveBeenCalled();
  });

  it('should handle string error correctly', () => {
    const error = 'String error message';
    
    renderWithI18n(<PokemonDetail error={error} />);

    expect(screen.getByText('String error message')).toBeInTheDocument();
  });

  it('should render pokemon number with proper padding', () => {
    const lowNumberPokemon = { ...mockPokemon, id: 1 };
    
    renderWithI18n(<PokemonDetail pokemon={lowNumberPokemon} />);

    expect(screen.getByText('No. 001')).toBeInTheDocument();
    expect(screen.getByText('#001')).toBeInTheDocument();
  });

  it('should capitalize pokemon name', () => {
    renderWithI18n(<PokemonDetail pokemon={mockPokemon} />);

    const nameElement = screen.getByText('pikachu');
    expect(nameElement).toHaveClass('capitalize');
  });
});