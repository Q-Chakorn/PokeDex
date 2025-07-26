import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { FilterBar } from '../FilterBar';
import type { PokemonType } from '../../../types/pokemon';

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

const mockTypes: PokemonType[] = [
  { name: 'fire', color: '#F08030' },
  { name: 'water', color: '#6890F0' },
  { name: 'grass', color: '#78C850' },
  { name: 'electric', color: '#F8D030' },
];

describe('FilterBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render search input and type filter', () => {
    renderWithI18n(
      <FilterBar
        searchQuery=""
        onSearchChange={vi.fn()}
        availableTypes={mockTypes}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
      />
    );

    expect(screen.getByPlaceholderText('Search Pokémon...')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
  });

  it('should call onSearchChange when search input changes', () => {
    const onSearchChange = vi.fn();
    
    renderWithI18n(
      <FilterBar
        searchQuery=""
        onSearchChange={onSearchChange}
        availableTypes={mockTypes}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search Pokémon...');
    fireEvent.change(searchInput, { target: { value: 'pikachu' } });

    expect(onSearchChange).toHaveBeenCalledWith('pikachu');
  });

  it('should show clear all button when filters are active', () => {
    renderWithI18n(
      <FilterBar
        searchQuery="pikachu"
        onSearchChange={vi.fn()}
        availableTypes={mockTypes}
        selectedTypes={[mockTypes[0]]}
        onTypesChange={vi.fn()}
      />
    );

    expect(screen.getByText('Clear all filters')).toBeInTheDocument();
  });

  it('should not show clear all button when no filters are active', () => {
    renderWithI18n(
      <FilterBar
        searchQuery=""
        onSearchChange={vi.fn()}
        availableTypes={mockTypes}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
      />
    );

    expect(screen.queryByText('Clear all filters')).not.toBeInTheDocument();
  });

  it('should call clear functions when clear all is clicked', () => {
    const onSearchChange = vi.fn();
    const onTypesChange = vi.fn();
    const onClearAll = vi.fn();
    
    renderWithI18n(
      <FilterBar
        searchQuery="pikachu"
        onSearchChange={onSearchChange}
        availableTypes={mockTypes}
        selectedTypes={[mockTypes[0]]}
        onTypesChange={onTypesChange}
        onClearAll={onClearAll}
      />
    );

    const clearButton = screen.getByText('Clear all filters');
    fireEvent.click(clearButton);

    expect(onSearchChange).toHaveBeenCalledWith('');
    expect(onTypesChange).toHaveBeenCalledWith([]);
    expect(onClearAll).toHaveBeenCalled();
  });

  it('should show results count when showResultsCount is true', () => {
    renderWithI18n(
      <FilterBar
        searchQuery=""
        onSearchChange={vi.fn()}
        availableTypes={mockTypes}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
        showResultsCount={true}
        resultsCount={150}
      />
    );

    expect(screen.getByText('150 Pokémon found')).toBeInTheDocument();
  });

  it('should show singular form for single result', () => {
    renderWithI18n(
      <FilterBar
        searchQuery=""
        onSearchChange={vi.fn()}
        availableTypes={mockTypes}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
        showResultsCount={true}
        resultsCount={1}
      />
    );

    expect(screen.getByText('1 Pokémon found')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    renderWithI18n(
      <FilterBar
        searchQuery=""
        onSearchChange={vi.fn()}
        availableTypes={mockTypes}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
        loading={true}
      />
    );

    expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument();
  });

  it('should disable controls when loading', () => {
    renderWithI18n(
      <FilterBar
        searchQuery="pikachu"
        onSearchChange={vi.fn()}
        availableTypes={mockTypes}
        selectedTypes={[mockTypes[0]]}
        onTypesChange={vi.fn()}
        loading={true}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search Pokémon...');
    const clearButton = screen.getByText('Clear all filters');

    expect(searchInput).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it('should show active filters summary', () => {
    renderWithI18n(
      <FilterBar
        searchQuery="pikachu"
        onSearchChange={vi.fn()}
        availableTypes={mockTypes}
        selectedTypes={[mockTypes[0], mockTypes[1]]}
        onTypesChange={vi.fn()}
        resultsCount={5}
      />
    );

    expect(screen.getByText('Search: "pikachu"')).toBeInTheDocument();
    expect(screen.getByText('2 types')).toBeInTheDocument();
  });

  it('should show singular type in summary', () => {
    renderWithI18n(
      <FilterBar
        searchQuery=""
        onSearchChange={vi.fn()}
        availableTypes={mockTypes}
        selectedTypes={[mockTypes[0]]}
        onTypesChange={vi.fn()}
        resultsCount={10}
      />
    );

    expect(screen.getByText('1 type')).toBeInTheDocument();
  });

  it('should use vertical layout when specified', () => {
    const { container } = renderWithI18n(
      <FilterBar
        searchQuery=""
        onSearchChange={vi.fn()}
        availableTypes={mockTypes}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
        layout="vertical"
      />
    );

    const layoutContainer = container.querySelector('.flex.flex-col.gap-4');
    expect(layoutContainer).toBeInTheDocument();
  });

  it('should use horizontal layout by default', () => {
    const { container } = renderWithI18n(
      <FilterBar
        searchQuery=""
        onSearchChange={vi.fn()}
        availableTypes={mockTypes}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
      />
    );

    const layoutContainer = container.querySelector('.flex.flex-col.sm\\:flex-row');
    expect(layoutContainer).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = renderWithI18n(
      <FilterBar
        searchQuery=""
        onSearchChange={vi.fn()}
        availableTypes={mockTypes}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should show quick clear button in results summary', () => {
    renderWithI18n(
      <FilterBar
        searchQuery="pikachu"
        onSearchChange={vi.fn()}
        availableTypes={mockTypes}
        selectedTypes={[mockTypes[0]]}
        onTypesChange={vi.fn()}
        resultsCount={5}
      />
    );

    const clearButtons = screen.getAllByText(/clear/i);
    expect(clearButtons.length).toBeGreaterThan(0);
  });

  it('should not show results summary when showResultsCount is false', () => {
    renderWithI18n(
      <FilterBar
        searchQuery="pikachu"
        onSearchChange={vi.fn()}
        availableTypes={mockTypes}
        selectedTypes={[mockTypes[0]]}
        onTypesChange={vi.fn()}
        showResultsCount={false}
        resultsCount={5}
      />
    );

    expect(screen.queryByText('5 Pokémon found')).not.toBeInTheDocument();
  });

  it('should handle empty search query in active filters', () => {
    renderWithI18n(
      <FilterBar
        searchQuery="   "
        onSearchChange={vi.fn()}
        availableTypes={mockTypes}
        selectedTypes={[mockTypes[0]]}
        onTypesChange={vi.fn()}
        resultsCount={10}
      />
    );

    // Should not show search filter badge for whitespace-only query
    expect(screen.queryByText(/Search:/)).not.toBeInTheDocument();
    // But should still show type filter
    expect(screen.getByText('1 type')).toBeInTheDocument();
  });
});