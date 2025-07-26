import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { PokemonCard } from '../PokemonCard';
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
  dexNumber: '#0025',
  name: 'Pikachu',
  imageUrl: 'https://example.com/pikachu.png',
  types: [
    { name: 'electric', color: '#F8D030' }
  ],
  abilities: [
    { name: 'Static', isHidden: false }
  ],
  hiddenAbility: { name: 'Lightning Rod', isHidden: true },
  eggGroups: ['Field', 'Fairy'],
  isLegendary: false,
  bio: 'Pikachu is an Electric-type Pokémon.',
  stats: {
    hp: 35,
    attack: 55,
    defense: 40,
    spAttack: 50,
    spDefense: 50,
    speed: 90,
    total: 320
  }
};

const mockLegendaryPokemon: Pokemon = {
  ...mockPokemon,
  id: 150,
  dexNumber: '#0150',
  name: 'Mewtwo',
  types: [
    { name: 'psychic', color: '#F85888' }
  ],
  isLegendary: true
};

const mockDualTypePokemon: Pokemon = {
  ...mockPokemon,
  id: 1,
  dexNumber: '#0001',
  name: 'Bulbasaur',
  types: [
    { name: 'grass', color: '#78C850' },
    { name: 'poison', color: '#A040A0' }
  ]
};

describe('PokemonCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render Pokemon card with basic information', () => {
    renderWithI18n(<PokemonCard pokemon={mockPokemon} />);

    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('#0025')).toBeInTheDocument();
    expect(screen.getByText('Electric')).toBeInTheDocument();
  });

  it('should render Pokemon image with correct alt text', () => {
    renderWithI18n(<PokemonCard pokemon={mockPokemon} />);

    const image = screen.getByAltText('Pikachu');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/pikachu.png');
  });

  it('should show legendary indicator for legendary Pokemon', () => {
    renderWithI18n(<PokemonCard pokemon={mockLegendaryPokemon} />);

    const legendaryIcon = screen.getByRole('button').querySelector('svg');
    expect(legendaryIcon).toBeInTheDocument();
  });

  it('should not show legendary indicator for non-legendary Pokemon', () => {
    renderWithI18n(<PokemonCard pokemon={mockPokemon} />);

    const legendaryIcon = screen.queryByRole('button')?.querySelector('svg');
    expect(legendaryIcon).not.toBeInTheDocument();
  });

  it('should render dual types correctly', () => {
    renderWithI18n(<PokemonCard pokemon={mockDualTypePokemon} />);

    expect(screen.getByText('Grass')).toBeInTheDocument();
    expect(screen.getByText('Poison')).toBeInTheDocument();
  });

  it('should call onClick when card is clicked', () => {
    const onClick = vi.fn();
    renderWithI18n(<PokemonCard pokemon={mockPokemon} onClick={onClick} />);

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(onClick).toHaveBeenCalledWith(mockPokemon);
  });

  it('should handle keyboard navigation', () => {
    const onClick = vi.fn();
    renderWithI18n(<PokemonCard pokemon={mockPokemon} onClick={onClick} />);

    const card = screen.getByRole('button');
    
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledWith(mockPokemon);

    fireEvent.keyDown(card, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('should not be clickable when onClick is not provided', () => {
    renderWithI18n(<PokemonCard pokemon={mockPokemon} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should apply small size classes', () => {
    renderWithI18n(<PokemonCard pokemon={mockPokemon} size="sm" />);

    const card = screen.getByText('Pikachu').closest('div');
    expect(card).toHaveClass('p-3');
  });

  it('should apply medium size classes (default)', () => {
    renderWithI18n(<PokemonCard pokemon={mockPokemon} />);

    const card = screen.getByText('Pikachu').closest('div');
    expect(card).toHaveClass('p-4');
  });

  it('should apply large size classes', () => {
    renderWithI18n(<PokemonCard pokemon={mockPokemon} size="lg" />);

    const card = screen.getByText('Pikachu').closest('div');
    expect(card).toHaveClass('p-6');
  });

  it('should show stats when showStats is true', () => {
    renderWithI18n(<PokemonCard pokemon={mockPokemon} showStats />);

    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('Attack')).toBeInTheDocument();
    expect(screen.getByText('Defense')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument(); // HP value
    expect(screen.getByText('55')).toBeInTheDocument(); // Attack value
    expect(screen.getByText('40')).toBeInTheDocument(); // Defense value
  });

  it('should not show stats when showStats is false (default)', () => {
    renderWithI18n(<PokemonCard pokemon={mockPokemon} />);

    expect(screen.queryByText('HP')).not.toBeInTheDocument();
    expect(screen.queryByText('Attack')).not.toBeInTheDocument();
    expect(screen.queryByText('Defense')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = renderWithI18n(
      <PokemonCard pokemon={mockPokemon} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should handle image loading states', async () => {
    renderWithI18n(<PokemonCard pokemon={mockPokemon} />);

    // Should show loading spinner initially
    const loadingSpinner = screen.getByRole('generic').querySelector('.animate-spin');
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('should handle image error states', async () => {
    renderWithI18n(<PokemonCard pokemon={mockPokemon} />);

    const image = screen.getByAltText('Pikachu');
    
    // Simulate image error
    fireEvent.error(image);

    await waitFor(() => {
      const errorIcon = screen.getByRole('generic').querySelector('svg');
      expect(errorIcon).toBeInTheDocument();
    });
  });

  it('should have proper accessibility attributes when clickable', () => {
    renderWithI18n(<PokemonCard pokemon={mockPokemon} onClick={vi.fn()} />);

    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-label', 'View details for Pikachu');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('should have hover effects when clickable', () => {
    renderWithI18n(<PokemonCard pokemon={mockPokemon} onClick={vi.fn()} />);

    const card = screen.getByRole('button');
    expect(card).toHaveClass('cursor-pointer', 'hover:scale-105', 'hover:-translate-y-1');
  });

  it('should render background gradient for dual types', () => {
    const { container } = renderWithI18n(<PokemonCard pokemon={mockDualTypePokemon} />);

    const gradientElement = container.querySelector('.absolute.inset-0.opacity-10');
    expect(gradientElement).toBeInTheDocument();
  });

  it('should use lazy loading for images', () => {
    renderWithI18n(<PokemonCard pokemon={mockPokemon} />);

    const image = screen.getByAltText('Pikachu');
    expect(image).toHaveAttribute('loading', 'lazy');
  });
});