import type { AppState, AppAction } from '../types/app';
import type { Pokemon, PokemonType } from '../types/pokemon';

export const initialState: AppState = {
  // Pokemon data
  pokemon: [],
  filteredPokemon: [],
  selectedPokemon: null,
  availableTypes: [],
  
  // Loading states
  loading: false,
  pokemonLoading: false,
  detailLoading: false,
  
  // Error states
  error: null,
  pokemonError: null,
  detailError: null,
  
  // Search and filter states
  searchQuery: '',
  selectedTypes: [],
  sortBy: 'id',
  sortOrder: 'asc',
  
  // Pagination
  currentPage: 1,
  itemsPerPage: 20,
  totalItems: 0,
  
  // UI states
  viewMode: 'grid',
  showFilters: false,
  
  // Navigation
  currentRoute: '/',
  previousRoute: null,
};

// Helper function to filter and sort Pokemon
const filterAndSortPokemon = (
  pokemon: Pokemon[],
  searchQuery: string,
  selectedTypes: PokemonType[],
  sortBy: AppState['sortBy'],
  sortOrder: AppState['sortOrder']
): Pokemon[] => {
  let filtered = [...pokemon];

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.id.toString().includes(query)
    );
  }

  // Apply type filter
  if (selectedTypes.length > 0) {
    filtered = filtered.filter(p =>
      selectedTypes.some(selectedType =>
        p.types.some(pokemonType => pokemonType.name === selectedType.name)
      )
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'id':
        comparison = a.id - b.id;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'type':
        comparison = a.types[0]?.name.localeCompare(b.types[0]?.name || '') || 0;
        break;
      default:
        comparison = a.id - b.id;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return filtered;
};

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    // Pokemon data actions
    case 'LOAD_POKEMON_START':
      return {
        ...state,
        pokemonLoading: true,
        pokemonError: null,
        loading: true,
      };

    case 'LOAD_POKEMON_SUCCESS': {
      const { pokemon, types } = action.payload;
      const filteredPokemon = filterAndSortPokemon(
        pokemon,
        state.searchQuery,
        state.selectedTypes,
        state.sortBy,
        state.sortOrder
      );
      
      return {
        ...state,
        pokemon,
        availableTypes: types,
        filteredPokemon,
        totalItems: filteredPokemon.length,
        pokemonLoading: false,
        loading: false,
        pokemonError: null,
        currentPage: 1, // Reset to first page
      };
    }

    case 'LOAD_POKEMON_ERROR':
      return {
        ...state,
        pokemonLoading: false,
        loading: false,
        pokemonError: action.payload,
      };

    // Pokemon detail actions
    case 'LOAD_POKEMON_DETAIL_START':
      return {
        ...state,
        detailLoading: true,
        detailError: null,
      };

    case 'LOAD_POKEMON_DETAIL_SUCCESS':
      return {
        ...state,
        selectedPokemon: action.payload,
        detailLoading: false,
        detailError: null,
      };

    case 'LOAD_POKEMON_DETAIL_ERROR':
      return {
        ...state,
        detailLoading: false,
        detailError: action.payload,
        selectedPokemon: null,
      };

    case 'CLEAR_SELECTED_POKEMON':
      return {
        ...state,
        selectedPokemon: null,
        detailError: null,
      };

    // Search and filter actions
    case 'SET_SEARCH_QUERY': {
      const filteredPokemon = filterAndSortPokemon(
        state.pokemon,
        action.payload,
        state.selectedTypes,
        state.sortBy,
        state.sortOrder
      );
      
      return {
        ...state,
        searchQuery: action.payload,
        filteredPokemon,
        totalItems: filteredPokemon.length,
        currentPage: 1, // Reset to first page
      };
    }

    case 'SET_SELECTED_TYPES': {
      const filteredPokemon = filterAndSortPokemon(
        state.pokemon,
        state.searchQuery,
        action.payload,
        state.sortBy,
        state.sortOrder
      );
      
      return {
        ...state,
        selectedTypes: action.payload,
        filteredPokemon,
        totalItems: filteredPokemon.length,
        currentPage: 1, // Reset to first page
      };
    }

    case 'ADD_TYPE_FILTER': {
      const newSelectedTypes = state.selectedTypes.some(
        type => type.name === action.payload.name
      ) 
        ? state.selectedTypes 
        : [...state.selectedTypes, action.payload];
      
      const filteredPokemon = filterAndSortPokemon(
        state.pokemon,
        state.searchQuery,
        newSelectedTypes,
        state.sortBy,
        state.sortOrder
      );
      
      return {
        ...state,
        selectedTypes: newSelectedTypes,
        filteredPokemon,
        totalItems: filteredPokemon.length,
        currentPage: 1,
      };
    }

    case 'REMOVE_TYPE_FILTER': {
      const newSelectedTypes = state.selectedTypes.filter(
        type => type.name !== action.payload.name
      );
      
      const filteredPokemon = filterAndSortPokemon(
        state.pokemon,
        state.searchQuery,
        newSelectedTypes,
        state.sortBy,
        state.sortOrder
      );
      
      return {
        ...state,
        selectedTypes: newSelectedTypes,
        filteredPokemon,
        totalItems: filteredPokemon.length,
        currentPage: 1,
      };
    }

    case 'CLEAR_FILTERS': {
      const filteredPokemon = filterAndSortPokemon(
        state.pokemon,
        '',
        [],
        state.sortBy,
        state.sortOrder
      );
      
      return {
        ...state,
        searchQuery: '',
        selectedTypes: [],
        filteredPokemon,
        totalItems: filteredPokemon.length,
        currentPage: 1,
      };
    }

    case 'SET_SORT': {
      const filteredPokemon = filterAndSortPokemon(
        state.pokemon,
        state.searchQuery,
        state.selectedTypes,
        action.payload.sortBy,
        action.payload.sortOrder
      );
      
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder,
        filteredPokemon,
        currentPage: 1, // Reset to first page
      };
    }

    // Pagination actions
    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: Math.max(1, Math.min(action.payload, Math.ceil(state.totalItems / state.itemsPerPage))),
      };

    case 'SET_ITEMS_PER_PAGE': {
      const newItemsPerPage = Math.max(1, action.payload);
      const newTotalPages = Math.ceil(state.totalItems / newItemsPerPage);
      const newCurrentPage = Math.min(state.currentPage, newTotalPages);
      
      return {
        ...state,
        itemsPerPage: newItemsPerPage,
        currentPage: Math.max(1, newCurrentPage),
      };
    }

    // UI actions
    case 'SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload,
      };

    case 'TOGGLE_FILTERS':
      return {
        ...state,
        showFilters: !state.showFilters,
      };

    case 'SET_SHOW_FILTERS':
      return {
        ...state,
        showFilters: action.payload,
      };

    // Navigation actions
    case 'SET_CURRENT_ROUTE':
      return {
        ...state,
        previousRoute: state.currentRoute,
        currentRoute: action.payload,
      };

    // General actions
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
        pokemonError: null,
        detailError: null,
      };

    case 'RESET_STATE':
      return {
        ...initialState,
      };

    default:
      return state;
  }
};