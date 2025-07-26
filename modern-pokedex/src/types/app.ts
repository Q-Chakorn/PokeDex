import type { Pokemon, PokemonType } from './pokemon';

// Theme types
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

// Language types
export type Language = 'en' | 'th' | 'ja';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export interface AppState {
  // Pokemon data
  pokemon: Pokemon[];
  filteredPokemon: Pokemon[];
  selectedPokemon: Pokemon | null;
  availableTypes: PokemonType[];

  // Loading states
  loading: boolean;
  pokemonLoading: boolean;
  detailLoading: boolean;

  // Error states
  error: string | null;
  pokemonError: string | null;
  detailError: string | null;

  // Search and filter states
  searchQuery: string;
  selectedTypes: PokemonType[];
  sortBy: 'id' | 'name' | 'type';
  sortOrder: 'asc' | 'desc';

  // Pagination
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;

  // UI states
  viewMode: 'grid' | 'list';
  showFilters: boolean;

  // Navigation
  currentRoute: string;
  previousRoute: string | null;
}

export type AppAction =
  // Pokemon data actions
  | { type: 'LOAD_POKEMON_START' }
  | { type: 'LOAD_POKEMON_SUCCESS'; payload: { pokemon: Pokemon[]; types: PokemonType[] } }
  | { type: 'LOAD_POKEMON_ERROR'; payload: string }

  // Pokemon detail actions
  | { type: 'LOAD_POKEMON_DETAIL_START' }
  | { type: 'LOAD_POKEMON_DETAIL_SUCCESS'; payload: Pokemon }
  | { type: 'LOAD_POKEMON_DETAIL_ERROR'; payload: string }
  | { type: 'CLEAR_SELECTED_POKEMON' }

  // Search and filter actions
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_TYPES'; payload: PokemonType[] }
  | { type: 'ADD_TYPE_FILTER'; payload: PokemonType }
  | { type: 'REMOVE_TYPE_FILTER'; payload: PokemonType }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_SORT'; payload: { sortBy: AppState['sortBy']; sortOrder: AppState['sortOrder'] } }

  // Pagination actions
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_ITEMS_PER_PAGE'; payload: number }

  // UI actions
  | { type: 'SET_VIEW_MODE'; payload: AppState['viewMode'] }
  | { type: 'TOGGLE_FILTERS' }
  | { type: 'SET_SHOW_FILTERS'; payload: boolean }

  // Navigation actions
  | { type: 'SET_CURRENT_ROUTE'; payload: string }

  // General actions
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET_STATE' };

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;

  // Computed values
  totalPages: number;
  currentPagePokemon: Pokemon[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  // Helper functions
  searchPokemon: (query: string) => void;
  filterByTypes: (types: PokemonType[]) => void;
  sortPokemon: (sortBy: AppState['sortBy'], sortOrder: AppState['sortOrder']) => void;
  goToPage: (page: number) => void;
  selectPokemon: (pokemon: Pokemon) => void;
  clearSelection: () => void;
  clearAllFilters: () => void;
}