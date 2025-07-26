import React from 'react';
import { render, screen, act, renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  AppProvider,
  useAppContext,
  usePokemonData,
  usePokemonDetail,
  useSearch,
  useFilters,
  usePagination,
  useSorting,
  useUI,
  useNavigation
} from '../AppContext';
import type { Pokemon, PokemonType } from '../../types/pokemon';

const mockPokemon: Pokemon[] = [
  {
    id: 1,
    name: 'bulbasaur',
    image: 'bulbasaur.png',
    types: [{ name: 'grass', color: '#78C850' }],
    height: 7,
    weight: 69,
    abilities: [{ name: 'overgrow', isHidden: false }],
    stats: { hp: 45, attack: 49, defense: 49, specialAttack: 65, specialDefense: 65, speed: 45, total: 318 }
  },
  {
    id: 4,
    name: 'charmander',
    image: 'charmander.png',
    types: [{ name: 'fire', color: '#F08030' }],
    height: 6,
    weight: 85,
    abilities: [{ name: 'blaze', isHidden: false }],
    stats: { hp: 39, attack: 52, defense: 43, specialAttack: 60, specialDefense: 50, speed: 65, total: 309 }
  }
];

const mockTypes: PokemonType[] = [
  { name: 'grass', color: '#78C850' },
  { name: 'fire', color: '#F08030' }
];

const TestComponent: React.FC = () => {
  const { state } = useAppContext();
  return <div data-testid="test-component">{state.pokemon.length}</div>;
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>{children}</AppProvider>
);

describe('AppContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide context to children', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('test-component')).toHaveTextContent('0');
  });

  it('should throw error when useAppContext is used outside provider', () => {
    const TestComponentWithoutProvider = () => {
      useAppContext();
      return <div>Test</div>;
    };

    expect(() => render(<TestComponentWithoutProvider />)).toThrow(
      'useAppContext must be used within an AppProvider'
    );
  });

  it('should accept initial state', () => {
    const initialAppState = {
      pokemon: mockPokemon,
      filteredPokemon: mockPokemon,
      totalItems: mockPokemon.length
    };

    const TestComponentWithInitialState = () => {
      const { state } = useAppContext();
      return <div data-testid="pokemon-count">{state.pokemon.length}</div>;
    };

    render(
      <AppProvider initialAppState={initialAppState}>
        <TestComponentWithInitialState />
      </AppProvider>
    );

    expect(screen.getByTestId('pokemon-count')).toHaveTextContent('2');
  });

  describe('Computed values', () => {
    it('should calculate totalPages correctly', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.dispatch({
          type: 'LOAD_POKEMON_SUCCESS',
          payload: { pokemon: mockPokemon, types: mockTypes }
        });
      });

      act(() => {
        result.current.dispatch({
          type: 'SET_ITEMS_PER_PAGE',
          payload: 1
        });
      });

      expect(result.current.totalPages).toBe(2);
    });

    it('should calculate currentPagePokemon correctly', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.dispatch({
          type: 'LOAD_POKEMON_SUCCESS',
          payload: { pokemon: mockPokemon, types: mockTypes }
        });
      });

      act(() => {
        result.current.dispatch({
          type: 'SET_ITEMS_PER_PAGE',
          payload: 1
        });
      });

      expect(result.current.currentPagePokemon).toHaveLength(1);
      expect(result.current.currentPagePokemon[0].name).toBe('bulbasaur');

      act(() => {
        result.current.dispatch({
          type: 'SET_CURRENT_PAGE',
          payload: 2
        });
      });

      expect(result.current.currentPagePokemon[0].name).toBe('charmander');
    });

    it('should calculate hasNextPage and hasPreviousPage correctly', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.dispatch({
          type: 'LOAD_POKEMON_SUCCESS',
          payload: { pokemon: mockPokemon, types: mockTypes }
        });
      });

      act(() => {
        result.current.dispatch({
          type: 'SET_ITEMS_PER_PAGE',
          payload: 1
        });
      });

      // Page 1
      expect(result.current.hasNextPage).toBe(true);
      expect(result.current.hasPreviousPage).toBe(false);

      // Page 2
      act(() => {
        result.current.dispatch({
          type: 'SET_CURRENT_PAGE',
          payload: 2
        });
      });

      expect(result.current.hasNextPage).toBe(false);
      expect(result.current.hasPreviousPage).toBe(true);
    });
  });

  describe('Helper functions', () => {
    it('should provide searchPokemon function', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.dispatch({
          type: 'LOAD_POKEMON_SUCCESS',
          payload: { pokemon: mockPokemon, types: mockTypes }
        });
      });

      act(() => {
        result.current.searchPokemon('char');
      });

      expect(result.current.state.searchQuery).toBe('char');
      expect(result.current.state.filteredPokemon).toHaveLength(1);
    });

    it('should provide filterByTypes function', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.dispatch({
          type: 'LOAD_POKEMON_SUCCESS',
          payload: { pokemon: mockPokemon, types: mockTypes }
        });
      });

      act(() => {
        result.current.filterByTypes([{ name: 'fire', color: '#F08030' }]);
      });

      expect(result.current.state.selectedTypes).toHaveLength(1);
      expect(result.current.state.filteredPokemon).toHaveLength(1);
    });

    it('should provide sortPokemon function', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.dispatch({
          type: 'LOAD_POKEMON_SUCCESS',
          payload: { pokemon: mockPokemon, types: mockTypes }
        });
      });

      act(() => {
        result.current.sortPokemon('name', 'desc');
      });

      expect(result.current.state.sortBy).toBe('name');
      expect(result.current.state.sortOrder).toBe('desc');
    });

    it('should provide goToPage function', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.goToPage(3);
      });

      expect(result.current.state.currentPage).toBe(3);
    });

    it('should provide selectPokemon function', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.selectPokemon(mockPokemon[0]);
      });

      expect(result.current.state.selectedPokemon).toEqual(mockPokemon[0]);
    });

    it('should provide clearSelection function', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.selectPokemon(mockPokemon[0]);
      });

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.state.selectedPokemon).toBe(null);
    });

    it('should provide clearAllFilters function', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.searchPokemon('test');
        result.current.filterByTypes([{ name: 'fire', color: '#F08030' }]);
      });

      act(() => {
        result.current.clearAllFilters();
      });

      expect(result.current.state.searchQuery).toBe('');
      expect(result.current.state.selectedTypes).toHaveLength(0);
    });
  });
});

describe('Custom hooks', () => {
  describe('usePokemonData', () => {
    it('should provide pokemon data and actions', () => {
      const { result } = renderHook(() => usePokemonData(), { wrapper });

      expect(result.current.pokemon).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);

      act(() => {
        result.current.loadPokemon();
      });

      expect(result.current.loading).toBe(true);

      act(() => {
        result.current.loadPokemonSuccess(mockPokemon, mockTypes);
      });

      expect(result.current.pokemon).toEqual(mockPokemon);
      expect(result.current.loading).toBe(false);

      act(() => {
        result.current.loadPokemonError('Test error');
      });

      expect(result.current.error).toBe('Test error');
    });
  });

  describe('usePokemonDetail', () => {
    it('should provide pokemon detail data and actions', () => {
      const { result } = renderHook(() => usePokemonDetail(), { wrapper });

      expect(result.current.selectedPokemon).toBe(null);
      expect(result.current.loading).toBe(false);

      act(() => {
        result.current.loadDetailStart();
      });

      expect(result.current.loading).toBe(true);

      act(() => {
        result.current.selectPokemon(mockPokemon[0]);
      });

      expect(result.current.selectedPokemon).toEqual(mockPokemon[0]);
      expect(result.current.loading).toBe(false);

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.selectedPokemon).toBe(null);
    });
  });

  describe('useSearch', () => {
    it('should provide search functionality', () => {
      const { result } = renderHook(() => useSearch(), { wrapper });

      expect(result.current.searchQuery).toBe('');

      act(() => {
        result.current.searchPokemon('test query');
      });

      expect(result.current.searchQuery).toBe('test query');
    });
  });

  describe('useFilters', () => {
    it('should provide filter functionality', () => {
      const { result } = renderHook(() => useFilters(), { wrapper });

      expect(result.current.selectedTypes).toEqual([]);
      expect(result.current.showFilters).toBe(false);

      const fireType = { name: 'fire', color: '#F08030' };

      act(() => {
        result.current.addTypeFilter(fireType);
      });

      expect(result.current.selectedTypes).toContain(fireType);

      act(() => {
        result.current.removeTypeFilter(fireType);
      });

      expect(result.current.selectedTypes).not.toContain(fireType);

      act(() => {
        result.current.toggleFilters();
      });

      expect(result.current.showFilters).toBe(true);
    });
  });

  describe('usePagination', () => {
    it('should provide pagination functionality', () => {
      const { result } = renderHook(() => usePagination(), { wrapper });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.itemsPerPage).toBe(20);

      act(() => {
        result.current.setItemsPerPage(10);
      });

      expect(result.current.itemsPerPage).toBe(10);

      act(() => {
        result.current.goToPage(2);
      });

      expect(result.current.currentPage).toBe(2);
    });

    it('should provide nextPage and previousPage functions', () => {
      const { result } = renderHook(() => {
        const appContext = useAppContext();
        const pagination = usePagination();
        return { appContext, pagination };
      }, { wrapper });

      // Set up data for pagination
      act(() => {
        result.current.appContext.dispatch({
          type: 'LOAD_POKEMON_SUCCESS',
          payload: { pokemon: mockPokemon, types: mockTypes }
        });
      });

      act(() => {
        result.current.appContext.dispatch({
          type: 'SET_ITEMS_PER_PAGE',
          payload: 1
        });
      });

      expect(result.current.pagination.currentPage).toBe(1);
      expect(result.current.pagination.hasNextPage).toBe(true);
      expect(result.current.pagination.hasPreviousPage).toBe(false);

      act(() => {
        result.current.pagination.nextPage();
      });

      expect(result.current.pagination.currentPage).toBe(2);

      act(() => {
        result.current.pagination.previousPage();
      });

      expect(result.current.pagination.currentPage).toBe(1);
    });
  });

  describe('useSorting', () => {
    it('should provide sorting functionality', () => {
      const { result } = renderHook(() => useSorting(), { wrapper });

      expect(result.current.sortBy).toBe('id');
      expect(result.current.sortOrder).toBe('asc');

      act(() => {
        result.current.sortPokemon('name', 'desc');
      });

      expect(result.current.sortBy).toBe('name');
      expect(result.current.sortOrder).toBe('desc');
    });
  });

  describe('useUI', () => {
    it('should provide UI state functionality', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      expect(result.current.viewMode).toBe('grid');
      expect(result.current.showFilters).toBe(false);

      act(() => {
        result.current.setViewMode('list');
      });

      expect(result.current.viewMode).toBe('list');

      act(() => {
        result.current.toggleFilters();
      });

      expect(result.current.showFilters).toBe(true);
    });
  });

  describe('useNavigation', () => {
    it('should provide navigation functionality', () => {
      const { result } = renderHook(() => useNavigation(), { wrapper });

      expect(result.current.currentRoute).toBe('/');
      expect(result.current.previousRoute).toBe(null);

      act(() => {
        result.current.setCurrentRoute('/pokemon');
      });

      expect(result.current.currentRoute).toBe('/pokemon');
      expect(result.current.previousRoute).toBe('/');

      act(() => {
        result.current.setCurrentRoute('/pokemon/1');
      });

      expect(result.current.currentRoute).toBe('/pokemon/1');
      expect(result.current.previousRoute).toBe('/pokemon');
    });
  });
});