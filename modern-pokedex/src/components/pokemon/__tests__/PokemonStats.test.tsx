import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { PokemonStats } from '../PokemonStats';
import type { PokemonStats as PokemonStatsType } from '../../../types/pokemon';

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

const mockStats: PokemonStatsType = {
  hp: 35,
  attack: 55,
  defense: 40,
  specialAttack: 50,
  specialDefense: 50,
  speed: 90,
  total: 320
};

const highStats: PokemonStatsType = {
  hp: 120,
  attack: 130,
  defense: 110,
  specialAttack: 140,
  specialDefense: 120,
  speed: 100,
  total: 720
};

describe('PokemonStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render all stat labels and values', () => {
    renderWithI18n(<PokemonStats stats={mockStats} />);

    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('Attack')).toBeInTheDocument();
    expect(screen.getByText('Defense')).toBeInTheDocument();
    expect(screen.getByText('Sp. Attack')).toBeInTheDocument();
    expect(screen.getByText('Sp. Defense')).toBeInTheDocument();
    expect(screen.getByText('Speed')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();

    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('320')).toBeInTheDocument();
  });

  it('should render compact variant correctly', () => {
    renderWithI18n(<PokemonStats stats={mockStats} variant="compact" />);

    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('320')).toBeInTheDocument();
  });

  it('should render detailed variant with ratings', () => {
    renderWithI18n(<PokemonStats stats={highStats} variant="detailed" />);

    expect(screen.getByText('Excellent')).toBeInTheDocument();
    expect(screen.getByText('Base Stat Total:')).toBeInTheDocument();
    expect(screen.getByText('720/720')).toBeInTheDocument();
    expect(screen.getByText('Average:')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument(); // Average calculation
  });

  it('should show comparison when enabled', () => {
    const comparisonStats: PokemonStatsType = {
      hp: 30,
      attack: 60,
      defense: 35,
      specialAttack: 45,
      specialDefense: 55,
      speed: 85,
      total: 310
    };

    renderWithI18n(
      <PokemonStats 
        stats={mockStats} 
        showComparison={true}
        comparisonStats={comparisonStats}
      />
    );

    expect(screen.getByText('Comparison')).toBeInTheDocument();
    expect(screen.getByText('+5')).toBeInTheDocument(); // HP difference
    expect(screen.getByText('-5')).toBeInTheDocument(); // Attack difference
  });

  it('should apply custom className', () => {
    const { container } = renderWithI18n(
      <PokemonStats stats={mockStats} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should handle zero stats correctly', () => {
    const zeroStats: PokemonStatsType = {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
      total: 0
    };

    renderWithI18n(<PokemonStats stats={zeroStats} />);

    const zeroValues = screen.getAllByText('0');
    expect(zeroValues.length).toBeGreaterThan(0);
  });

  it('should handle maximum stats correctly', () => {
    const maxStats: PokemonStatsType = {
      hp: 255,
      attack: 255,
      defense: 255,
      specialAttack: 255,
      specialDefense: 255,
      speed: 255,
      total: 1530
    };

    renderWithI18n(<PokemonStats stats={maxStats} />);

    expect(screen.getByText('1530')).toBeInTheDocument();
  });

  it('should show equal comparison correctly', () => {
    renderWithI18n(
      <PokemonStats 
        stats={mockStats} 
        showComparison={true}
        comparisonStats={mockStats}
      />
    );

    expect(screen.getByText('Comparison')).toBeInTheDocument();
    const equalSigns = screen.getAllByText('=');
    expect(equalSigns.length).toBe(6); // One for each stat
  });

  it('should render stats distribution chart in detailed variant', () => {
    renderWithI18n(<PokemonStats stats={mockStats} variant="detailed" />);

    expect(screen.getByText('Stats Distribution')).toBeInTheDocument();
    
    // Check for SVG element
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should not show comparison when showComparison is false', () => {
    const comparisonStats: PokemonStatsType = {
      hp: 30,
      attack: 60,
      defense: 35,
      specialAttack: 45,
      specialDefense: 55,
      speed: 85,
      total: 310
    };

    renderWithI18n(
      <PokemonStats 
        stats={mockStats} 
        showComparison={false}
        comparisonStats={comparisonStats}
      />
    );

    expect(screen.queryByText('Comparison')).not.toBeInTheDocument();
  });

  it('should not show comparison when comparisonStats is not provided', () => {
    renderWithI18n(
      <PokemonStats 
        stats={mockStats} 
        showComparison={true}
      />
    );

    expect(screen.queryByText('Comparison')).not.toBeInTheDocument();
  });

  it('should calculate average correctly in detailed variant', () => {
    renderWithI18n(<PokemonStats stats={mockStats} variant="detailed" />);

    // Average should be 320/6 = 53.33... rounded to 53
    expect(screen.getByText('53')).toBeInTheDocument();
  });

  it('should show different stat ratings based on values', () => {
    const mixedStats: PokemonStatsType = {
      hp: 30,    // Poor
      attack: 70, // Average  
      defense: 95, // Good
      specialAttack: 130, // Excellent
      specialDefense: 50,
      speed: 80,
      total: 455
    };

    renderWithI18n(<PokemonStats stats={mixedStats} variant="detailed" />);

    expect(screen.getByText('Poor')).toBeInTheDocument();
    expect(screen.getByText('Average')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });

  it('should handle negative comparison differences', () => {
    const lowerStats: PokemonStatsType = {
      hp: 25,
      attack: 45,
      defense: 30,
      specialAttack: 40,
      specialDefense: 40,
      speed: 80,
      total: 260
    };

    renderWithI18n(
      <PokemonStats 
        stats={lowerStats} 
        showComparison={true}
        comparisonStats={mockStats}
      />
    );

    expect(screen.getByText('-10')).toBeInTheDocument(); // HP difference
    expect(screen.getByText('-10')).toBeInTheDocument(); // Attack difference
  });

  it('should render all stat bars with proper structure', () => {
    renderWithI18n(<PokemonStats stats={mockStats} />);

    // Check for progress bar elements (divs with background colors)
    const progressBars = document.querySelectorAll('[style*="width"]');
    expect(progressBars.length).toBeGreaterThan(0);
  });
});