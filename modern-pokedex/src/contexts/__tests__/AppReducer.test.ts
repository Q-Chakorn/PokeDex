import { describe, it, expect } from 'vitest';
import { appReducer, initialState } from '../AppReducer';
import type { AppState, AppAction } from '../../types/app';
import type { Pokemon, PokemonType } from '../../types/pokemon';

const mockPokemon: Pokemon[] = [
  {
    id: 1,
    name: 'bulbasaur',
    image: 'bulbasaur.png',
    types: [{ name: 'grass', color: '#78C850' }, { name: 'poison', color: '#A040A0' }],
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
  },
  {
    id: 7,
    name: 'squirtle',
    image: 'squirtle.png',
    types: [{ name: 'water', color: '#6890F0' }],
    height: 5,
    weight: 90,
    abilities: [{ name: 'torrent', isHidden: false }],
    stats: { hp: 44, attack: 48, defense: 65, specialAttack: 50, specialDefense: 64, speed: 43, total: 314 }
  }
];

const mockTypes: PokemonType[] = [
  { name: 'grass', color: '#78C850' },
  { name: 'poison', color: '#A040A0' },
  { name: 'fire', color: '#F08030' },
  { name: 'water', color: '#6890F0' }
];

describe('appReducer', () => {
  it('should return initial state', () => {
    const state = appReducer(initialState, { type: 'CLEAR_ERROR' });
    expect(state).toEqual(initialState);
  });

  describe('Pokemon data actions', () => {
    it('should handle LOAD_POKEMON_START', () => {
      const action: AppAction = { type: 'LOAD_POKEMON_START' };
      const state = appReducer(initialState, action);

      expect(state.pokemonLoading).toBe(true);
      expect(state.loading).toBe(true);
      expect(state.pokemonError).toBe(null);
    });

    it('should handle LOAD_POKEMON_SUCCESS', () => {
      const action: AppAction = {
        type: 'LOAD_POKEMON_SUCCESS',
        payload: { pokemon: mockPokemon, types: mockTypes }
      };
      const state = appReducer(initialState, action);

      expect(state.pokemon).toEqual(mockPokemon);
      expect(state.availableTypes).toEqual(mockTypes);
      expect(state.filteredPokemon).toEqual(mockPokemon);
      expect(state.totalItems).toBe(mockPokemon.length);
      expect(state.pokemonLoading).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.pokemonError).toBe(null);
      expect(state.currentPage).toBe(1);
    });

    it('should handle LOAD_POKEMON_ERROR', () => {
      const errorMessage = 'Failed to load Pokemon';
      const action: AppAction = { type: 'LOAD_POKEMON_ERROR', payload: errorMessage };
      const state = appReducer(initialState, action);

      expect(state.pokemonLoading).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.pokemonError).toBe(errorMessage);
    });
  });

  describe('Pokemon detail actions', () => {
    it('should handle LOAD_POKEMON_DETAIL_START', () => {
      const action: AppAction = { type: 'LOAD_POKEMON_DETAIL_START' };
      const state = appReducer(initialState, action);

      expect(state.detailLoading).toBe(true);
      expect(state.detailError).toBe(null);
    });

    it('should handle LOAD_POKEMON_DETAIL_SUCCESS', () => {
      const action: AppAction = {
        type: 'LOAD_POKEMON_DETAIL_SUCCESS',
        payload: mockPokemon[0]
      };
      const state = appReducer(initialState, action);

      expect(state.selectedPokemon).toEqual(mockPokemon[0]);
      expect(state.detailLoading).toBe(false);
      expect(state.detailError).toBe(null);
    });

    it('should handle LOAD_POKEMON_DETAIL_ERROR', () => {
      const errorMessage = 'Failed to load Pokemon detail';
      const action: AppAction = { type: 'LOAD_POKEMON_DETAIL_ERROR', payload: errorMessage };
      const state = appReducer(initialState, action);

      expect(state.detailLoading).toBe(false);
      expect(state.detailError).toBe(errorMessage);
      expect(state.selectedPokemon).toBe(null);
    });

    it('should handle CLEAR_SELECTED_POKEMON', () => {
      const stateWithSelected = {
        ...initialState,
        selectedPokemon: mockPokemon[0],
        detailError: 'Some error'
      };
      const action: AppAction = { type: 'CLEAR_SELECTED_POKEMON' };
      const state = appReducer(stateWithSelected, action);

      expect(state.selectedPokemon).toBe(null);
      expect(state.detailError).toBe(null);
    });
  });

  describe('Search and filter actions', () => {
    const stateWithPokemon = {
      ...initialState,
      pokemon: mockPokemon,
      filteredPokemon: mockPokemon,
      totalItems: mockPokemon.length
    };

    it('should handle SET_SEARCH_QUERY', () => {
      const action: AppAction = { type: 'SET_SEARCH_QUERY', payload: 'char' };
      const state = appReducer(stateWithPokemon, action);

      expect(state.searchQuery).toBe('char');
      expect(state.filteredPokemon).toHaveLength(1);
      expect(state.filteredPokemon[0].name).toBe('charmander');
      expect(state.currentPage).toBe(1);
    });

    it('should handle SET_SELECTED_TYPES', () => {
      const fireType = { name: 'fire', color: '#F08030' };
      const action: AppAction = { type: 'SET_SELECTED_TYPES', payload: [fireType] };
      const state = appReducer(stateWithPokemon, action);

      expect(state.selectedTypes).toEqual([fireType]);
      expect(state.filteredPokemon).toHaveLength(1);
      expect(state.filteredPokemon[0].name).toBe('charmander');
      expect(state.currentPage).toBe(1);
    });

    it('should handle ADD_TYPE_FILTER', () => {
      const fireType = { name: 'fire', color: '#F08030' };
      const action: AppAction = { type: 'ADD_TYPE_FILTER', payload: fireType };
      const state = appReducer(stateWithPokemon, action);

      expect(state.selectedTypes).toContain(fireType);
      expect(state.filteredPokemon).toHaveLength(1);
      expect(state.filteredPokemon[0].name).toBe('charmander');
    });

    it('should not add duplicate type filter', () => {
      const fireType = { name: 'fire', color: '#F08030' };
      const stateWithFireType = {
        ...stateWithPokemon,
        selectedTypes: [fireType]
      };
      const action: AppAction = { type: 'ADD_TYPE_FILTER', payload: fireType };
      const state = appReducer(stateWithFireType, action);

      expect(state.selectedTypes).toHaveLength(1);
      expect(state.selectedTypes[0]).toEqual(fireType);
    });

    it('should handle REMOVE_TYPE_FILTER', () => {
      const fireType = { name: 'fire', color: '#F08030' };
      const waterType = { name: 'water', color: '#6890F0' };
      const stateWithTypes = {
        ...stateWithPokemon,
        selectedTypes: [fireType, waterType]
      };
      const action: AppAction = { type: 'REMOVE_TYPE_FILTER', payload: fireType };
      const state = appReducer(stateWithTypes, action);

      expect(state.selectedTypes).toEqual([waterType]);
      expect(state.selectedTypes).not.toContain(fireType);
    });

    it('should handle CLEAR_FILTERS', () => {
      const stateWithFilters = {
        ...stateWithPokemon,
        searchQuery: 'char',
        selectedTypes: [{ name: 'fire', color: '#F08030' }]
      };
      const action: AppAction = { type: 'CLEAR_FILTERS' };
      const state = appReducer(stateWithFilters, action);

      expect(state.searchQuery).toBe('');
      expect(state.selectedTypes).toEqual([]);
      expect(state.filteredPokemon).toEqual(mockPokemon);
      expect(state.currentPage).toBe(1);
    });

    it('should handle SET_SORT', () => {
      const action: AppAction = {
        type: 'SET_SORT',
        payload: { sortBy: 'name', sortOrder: 'desc' }
      };
      const state = appReducer(stateWithPokemon, action);

      expect(state.sortBy).toBe('name');
      expect(state.sortOrder).toBe('desc');
      expect(state.filteredPokemon[0].name).toBe('squirtle'); // Should be sorted by name desc
      expect(state.currentPage).toBe(1);
    });
  });

  describe('Pagination actions', () => {
    it('should handle SET_CURRENT_PAGE', () => {
      const action: AppAction = { type: 'SET_CURRENT_PAGE', payload: 2 };
      const state = appReducer(initialState, action);

      expect(state.currentPage).toBe(2);
    });

    it('should not set page below 1', () => {
      const action: AppAction = { type: 'SET_CURRENT_PAGE', payload: 0 };
      const state = appReducer(initialState, action);

      expect(state.currentPage).toBe(1);
    });

    it('should not set page above maximum', () => {
      const stateWithItems = {
        ...initialState,
        totalItems: 10,
        itemsPerPage: 5 // 2 pages total
      };
      const action: AppAction = { type: 'SET_CURRENT_PAGE', payload: 5 };
      const state = appReducer(stateWithItems, action);

      expect(state.currentPage).toBe(2); // Should be capped at max page
    });

    it('should handle SET_ITEMS_PER_PAGE', () => {
      const stateWithItems = {
        ...initialState,
        totalItems: 100,
        currentPage: 10
      };
      const action: AppAction = { type: 'SET_ITEMS_PER_PAGE', payload: 50 };
      const state = appReducer(stateWithItems, action);

      expect(state.itemsPerPage).toBe(50);
      expect(state.currentPage).toBe(2); // Should adjust current page
    });

    it('should not set items per page below 1', () => {
      const action: AppAction = { type: 'SET_ITEMS_PER_PAGE', payload: 0 };
      const state = appReducer(initialState, action);

      expect(state.itemsPerPage).toBe(1);
    });
  });

  describe('UI actions', () => {
    it('should handle SET_VIEW_MODE', () => {
      const action: AppAction = { type: 'SET_VIEW_MODE', payload: 'list' };
      const state = appReducer(initialState, action);

      expect(state.viewMode).toBe('list');
    });

    it('should handle TOGGLE_FILTERS', () => {
      const action: AppAction = { type: 'TOGGLE_FILTERS' };
      const state = appReducer(initialState, action);

      expect(state.showFilters).toBe(true);

      const state2 = appReducer(state, action);
      expect(state2.showFilters).toBe(false);
    });

    it('should handle SET_SHOW_FILTERS', () => {
      const action: AppAction = { type: 'SET_SHOW_FILTERS', payload: true };
      const state = appReducer(initialState, action);

      expect(state.showFilters).toBe(true);
    });
  });

  describe('Navigation actions', () => {
    it('should handle SET_CURRENT_ROUTE', () => {
      const stateWithRoute = {
        ...initialState,
        currentRoute: '/pokemon'
      };
      const action: AppAction = { type: 'SET_CURRENT_ROUTE', payload: '/pokemon/1' };
      const state = appReducer(stateWithRoute, action);

      expect(state.currentRoute).toBe('/pokemon/1');
      expect(state.previousRoute).toBe('/pokemon');
    });
  });

  describe('General actions', () => {
    it('should handle CLEAR_ERROR', () => {
      const stateWithErrors = {
        ...initialState,
        error: 'General error',
        pokemonError: 'Pokemon error',
        detailError: 'Detail error'
      };
      const action: AppAction = { type: 'CLEAR_ERROR' };
      const state = appReducer(stateWithErrors, action);

      expect(state.error).toBe(null);
      expect(state.pokemonError).toBe(null);
      expect(state.detailError).toBe(null);
    });

    it('should handle RESET_STATE', () => {
      const modifiedState = {
        ...initialState,
        pokemon: mockPokemon,
        searchQuery: 'test',
        currentPage: 5
      };
      const action: AppAction = { type: 'RESET_STATE' };
      const state = appReducer(modifiedState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('Filtering and sorting logic', () => {
    const stateWithPokemon = {
      ...initialState,
      pokemon: mockPokemon,
      filteredPokemon: mockPokemon,
      totalItems: mockPokemon.length
    };

    it('should filter by search query and type simultaneously', () => {
      // First set search query
      let state = appReducer(stateWithPokemon, {
        type: 'SET_SEARCH_QUERY',
        payload: 'a' // Should match bulbasaur and charmander
      });

      expect(state.filteredPokemon).toHaveLength(2);

      // Then add type filter
      state = appReducer(state, {
        type: 'SET_SELECTED_TYPES',
        payload: [{ name: 'fire', color: '#F08030' }]
      });

      expect(state.filteredPokemon).toHaveLength(1);
      expect(state.filteredPokemon[0].name).toBe('charmander');
    });

    it('should sort by different criteria', () => {
      // Sort by name ascending
      let state = appReducer(stateWithPokemon, {
        type: 'SET_SORT',
        payload: { sortBy: 'name', sortOrder: 'asc' }
      });

      expect(state.filteredPokemon[0].name).toBe('bulbasaur');
      expect(state.filteredPokemon[2].name).toBe('squirtle');

      // Sort by ID descending
      state = appReducer(state, {
        type: 'SET_SORT',
        payload: { sortBy: 'id', sortOrder: 'desc' }
      });

      expect(state.filteredPokemon[0].id).toBe(7);
      expect(state.filteredPokemon[2].id).toBe(1);
    });
  });
});