import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { FilterPanel } from '../FilterPanel';
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
  { name: 'psychic', color: '#F85888' },
  { name: 'ice', color: '#98D8D8' },
  { name: 'dragon', color: '#7038F8' },
  { name: 'dark', color: '#705848' },
  { name: 'fairy', color: '#EE99AC' },
  { name: 'fighting', color: '#C03028' },
  { name: 'poison', color: '#A040A0' },
  { name: 'ground', color: '#E0C068' }
];

describe('FilterPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render filter panel with title', () => {
    renderWithI18n(
      <FilterPanel
        availableTypes={mockTypes}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
      />
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('should render available types', () => {
    renderWithI18n(
      <FilterPanel
        availableTypes={mockTypes.slice(0, 3)}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
      />
    );

    expect(screen.getByText('Fire')).toBeInTheDocument();
    expect(screen.getByText('Water')).toBeInTheDocument();
    expect(screen.getByText('Grass')).toBeInTheDocument();
  });

  it('should show selected count badge', () => {
    const selectedTypes = [mockTypes[0], mockTypes[1]];
    
    renderWithI18n(
      <FilterPanel
        availableTypes={mockTypes}
        selectedTypes={selectedTypes}
        onTypesChange={vi.fn()}
      />
    );

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should call onTypesChange when type is selected', () => {
    const onTypesChange = vi.fn();
    
    renderWithI18n(
      <FilterPanel
        availableTypes={mockTypes.slice(0, 3)}
        selectedTypes={[]}
        onTypesChange={onTypesChange}
      />
    );

    const fireButton = screen.getByLabelText('Add Fire filter');
    fireEvent.click(fireButton);

    expect(onTypesChange).toHaveBeenCalledWith([mockTypes[0]]);
  });

  it('should call onTypesChange when type is deselected', () => {
    const onTypesChange = vi.fn();
    const selectedTypes = [mockTypes[0]];
    
    renderWithI18n(
      <FilterPanel
        availableTypes={mockTypes.slice(0, 3)}
        selectedTypes={selectedTypes}
        onTypesChange={onTypesChange}
      />
    );

    const fireButton = screen.getByLabelText('Remove Fire filter');
    fireEvent.click(fireButton);

    expect(onTypesChange).toHaveBeenCalledWith([]);
  });

  it('should show clear all button when types are selected', () => {
    const selectedTypes = [mockTypes[0], mockTypes[1]];
    
    renderWithI18n(
      <FilterPanel
        availableTypes={mockTypes}
        selectedTypes={selectedTypes}
        onTypesChange={vi.fn()}
      />
    );

    expect(screen.getByText('Clear all filters')).toBeInTheDocument();
  });

  it('should call onClearAll when clear all is clicked', () => {
    const onTypesChange = vi.fn();
    const onClearAll = vi.fn();
    const selectedTypes = [mockTypes[0], mockTypes[1]];
    
    renderWithI18n(
      <FilterPanel
        availableTypes={mockTypes}
        selectedTypes={selectedTypes}
        onTypesChange={onTypesChange}
        onClearAll={onClearAll}
      />
    );

    const clearButton = screen.getByText('Clear all filters');
    fireEvent.click(clearButton);

    expect(onTypesChange).toHaveBeenCalledWith([]);
    expect(onClearAll).toHaveBeenCalled();
  });

  it('should be collapsible when isCollapsible is true', () => {
    renderWithI18n(
      <FilterPanel
        availableTypes={mockTypes.slice(0, 3)}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
        isCollapsible={true}
        defaultExpanded={true}
      />
    );

    const collapseButton = screen.getByLabelText('Collapse filters');
    expect(collapseButton).toBeInTheDocument();

    fireEvent.click(collapseButton);

    // Types should be hidden after collapse
    expect(screen.queryByText('Fire')).not.toBeInTheDocument();
  });

  it('should show limited types initially and expand on show all', () => {
    renderWithI18n(
      <FilterPanel
        availableTypes={mockTypes}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
        maxVisibleTypes={3}
      />
    );

    // Should show first 3 types
    expect(screen.getByText('Fire')).toBeInTheDocument();
    expect(screen.getByText('Water')).toBeInTheDocument();
    expect(screen.getByText('Grass')).toBeInTheDocument();
    
    // Should not show 4th type initially
    expect(screen.queryByText('Electric')).not.toBeInTheDocument();

    // Should show "Show all" button
    const showAllButton = screen.getByText('Show all types');
    fireEvent.click(showAllButton);

    // Should now show all types
    expect(screen.getByText('Electric')).toBeInTheDocument();
  });

  it('should show selected types summary', () => {
    const selectedTypes = [mockTypes[0], mockTypes[1]];
    
    renderWithI18n(
      <FilterPanel
        availableTypes={mockTypes}
        selectedTypes={selectedTypes}
        onTypesChange={vi.fn()}
      />
    );

    expect(screen.getByText('Selected Types (2)')).toBeInTheDocument();
  });

  it('should allow removing types from selected summary', () => {
    const onTypesChange = vi.fn();
    const selectedTypes = [mockTypes[0], mockTypes[1]];
    
    renderWithI18n(
      <FilterPanel
        availableTypes={mockTypes}
        selectedTypes={selectedTypes}
        onTypesChange={onTypesChange}
      />
    );

    // Find the remove button for Fire type in the summary
    const removeButtons = screen.getAllByLabelText('Remove Fire filter');
    const summaryRemoveButton = removeButtons[1]; // Second one should be in summary
    
    fireEvent.click(summaryRemoveButton);

    expect(onTypesChange).toHaveBeenCalledWith([mockTypes[1]]);
  });

  it('should apply custom className', () => {
    const { container } = renderWithI18n(
      <FilterPanel
        availableTypes={mockTypes.slice(0, 3)}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should show selection indicators for selected types', () => {
    const selectedTypes = [mockTypes[0]];
    
    renderWithI18n(
      <FilterPanel
        availableTypes={mockTypes.slice(0, 3)}
        selectedTypes={selectedTypes}
        onTypesChange={vi.fn()}
      />
    );

    const fireButtons = screen.getAllByLabelText('Remove Fire filter');
    const mainFireButton = fireButtons[0]; // First one should be the main filter button
    expect(mainFireButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('should not show collapse button when isCollapsible is false', () => {
    renderWithI18n(
      <FilterPanel
        availableTypes={mockTypes.slice(0, 3)}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
        isCollapsible={false}
      />
    );

    expect(screen.queryByLabelText('Collapse filters')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Expand filters')).not.toBeInTheDocument();
  });
});