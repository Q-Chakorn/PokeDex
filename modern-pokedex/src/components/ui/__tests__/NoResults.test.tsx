import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { NoResults } from '../NoResults';

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

describe('NoResults', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render general no results message', () => {
    renderWithI18n(<NoResults />);

    expect(screen.getByText('No Pokémon found')).toBeInTheDocument();
    expect(screen.getByText('No Pokémon data is currently available.')).toBeInTheDocument();
  });

  it('should render search-specific message', () => {
    renderWithI18n(<NoResults searchQuery="pikachu" />);

    expect(screen.getByText('No results for "pikachu"')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search terms or filters to find what you\'re looking for.')).toBeInTheDocument();
  });

  it('should render filter-specific message', () => {
    renderWithI18n(<NoResults selectedTypes={['fire', 'water']} />);

    expect(screen.getByText('No Pokémon match the selected 2 types')).toBeInTheDocument();
  });

  it('should render combined search and filter message', () => {
    renderWithI18n(
      <NoResults 
        searchQuery="char" 
        selectedTypes={['water']} 
      />
    );

    expect(screen.getByText('No results for "char" with 1 type selected')).toBeInTheDocument();
  });

  it('should render custom message when provided', () => {
    renderWithI18n(<NoResults customMessage="Custom no results message" />);

    expect(screen.getByText('Custom no results message')).toBeInTheDocument();
  });

  it('should render custom icon when provided', () => {
    const customIcon = <div data-testid="custom-icon">Custom Icon</div>;
    
    renderWithI18n(<NoResults customIcon={customIcon} />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('should show clear search button when search query exists', () => {
    const onClearSearch = vi.fn();
    
    renderWithI18n(
      <NoResults 
        searchQuery="pikachu" 
        onClearSearch={onClearSearch}
      />
    );

    const clearSearchButton = screen.getByText('Clear search');
    expect(clearSearchButton).toBeInTheDocument();
    
    fireEvent.click(clearSearchButton);
    expect(onClearSearch).toHaveBeenCalled();
  });

  it('should show clear filters button when types are selected', () => {
    const onClearFilters = vi.fn();
    
    renderWithI18n(
      <NoResults 
        selectedTypes={['fire']} 
        onClearFilters={onClearFilters}
      />
    );

    const clearFiltersButton = screen.getByText('Clear type filters');
    expect(clearFiltersButton).toBeInTheDocument();
    
    fireEvent.click(clearFiltersButton);
    expect(onClearFilters).toHaveBeenCalled();
  });

  it('should show clear all button when both search and filters exist', () => {
    const onClearSearch = vi.fn();
    const onClearFilters = vi.fn();
    
    renderWithI18n(
      <NoResults 
        searchQuery="pikachu"
        selectedTypes={['fire']} 
        onClearSearch={onClearSearch}
        onClearFilters={onClearFilters}
      />
    );

    const clearAllButton = screen.getByText('Clear all filters');
    expect(clearAllButton).toBeInTheDocument();
    
    fireEvent.click(clearAllButton);
    expect(onClearSearch).toHaveBeenCalled();
    expect(onClearFilters).toHaveBeenCalled();
  });

  it('should show suggestions when showSuggestions is true and filters exist', () => {
    renderWithI18n(
      <NoResults 
        searchQuery="pikachu"
        showSuggestions={true}
      />
    );

    expect(screen.getByText('Try these suggestions:')).toBeInTheDocument();
    expect(screen.getByText('Check your spelling')).toBeInTheDocument();
    expect(screen.getByText('Try different or more general keywords')).toBeInTheDocument();
    expect(screen.getByText('Remove some filters to broaden your search')).toBeInTheDocument();
    expect(screen.getByText('Browse all Pokémon without filters')).toBeInTheDocument();
  });

  it('should not show suggestions when showSuggestions is false', () => {
    renderWithI18n(
      <NoResults 
        searchQuery="pikachu"
        showSuggestions={false}
      />
    );

    expect(screen.queryByText('Try these suggestions:')).not.toBeInTheDocument();
  });

  it('should not show suggestions when no filters are active', () => {
    renderWithI18n(<NoResults showSuggestions={true} />);

    expect(screen.queryByText('Try these suggestions:')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = renderWithI18n(
      <NoResults className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should handle empty search query correctly', () => {
    renderWithI18n(<NoResults searchQuery="   " />);

    // Should not treat whitespace-only query as a search
    expect(screen.getByText('No Pokémon found')).toBeInTheDocument();
    expect(screen.queryByText('No results for')).not.toBeInTheDocument();
  });

  it('should handle single type filter correctly', () => {
    renderWithI18n(<NoResults selectedTypes={['fire']} />);

    expect(screen.getByText('No Pokémon match the selected 1 type')).toBeInTheDocument();
  });

  it('should not show action buttons when callbacks are not provided', () => {
    renderWithI18n(
      <NoResults 
        searchQuery="pikachu"
        selectedTypes={['fire']}
      />
    );

    expect(screen.queryByText('Clear search')).not.toBeInTheDocument();
    expect(screen.queryByText('Clear type filters')).not.toBeInTheDocument();
    expect(screen.queryByText('Clear all filters')).not.toBeInTheDocument();
  });

  it('should render default search icon when no custom icon provided', () => {
    renderWithI18n(<NoResults />);

    // Check for SVG element with search icon path
    const searchIcon = screen.getByRole('img', { hidden: true });
    expect(searchIcon).toBeInTheDocument();
  });

  it('should handle multiple selected types correctly', () => {
    renderWithI18n(<NoResults selectedTypes={['fire', 'water', 'grass']} />);

    expect(screen.getByText('No Pokémon match the selected 3 types')).toBeInTheDocument();
  });
});