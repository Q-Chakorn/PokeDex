import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import type { AppContextType, AppState, AppAction } from '../types/app';
import type { Pokemon, PokemonType } from '../types/pokemon';
import { appReducer, initialState } from './AppReducer';

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
  initialAppState?: Partial<AppState>;
}

export const AppProvider: React.FC<AppProviderProps> = ({ 
  children, 
  initialAppState 
}) => {
  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    ...initialAppState,
  });

  // Computed values
  const totalPages = useMemo(() => {
    return Math.ceil(state.totalItems / state.itemsPerPage);
  }, [state.totalItems, state.itemsPerPage]);

  const currentPagePokemon = useMemo(() => {
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    return state.filteredPokemon.slice(startIndex, endIndex);
  }, [state.filteredPokemon, state.currentPage, state.itemsPerPage]);

  const hasNextPage = useMemo(() => {
    return state.currentPage < totalPages;
  }, [state.currentPage, totalPages]);

  const hasPreviousPage = useMemo(() => {
    return state.currentPage > 1;
  }, [state.currentPage]);

  // Helper functions
  const searchPokemon = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const filterByTypes = useCallback((types: PokemonType[]) => {
    dispatch({ type: 'SET_SELECTED_TYPES', payload: types });
  }, []);

  const sortPokemon = useCallback((sortBy: AppState['sortBy'], sortOrder: AppState['sortOrder']) => {
    dispatch({ type: 'SET_SORT', payload: { sortBy, sortOrder } });
  }, []);

  const goToPage = useCallback((page: number) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  }, []);

  const selectPokemon = useCallback((pokemon: Pokemon) => {
    dispatch({ type: 'LOAD_POKEMON_DETAIL_SUCCESS', payload: pokemon });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTED_POKEMON' });
  }, []);

  const clearAllFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, []);

  const contextValue = useMemo<AppContextType>(() => ({
    state,
    dispatch,
    totalPages,
    currentPagePokemon,
    hasNextPage,
    hasPreviousPage,
    searchPokemon,
    filterByTypes,
    sortPokemon,
    goToPage,
    selectPokemon,
    clearSelection,
    clearAllFilters,
  }), [
    state,
    totalPages,
    currentPagePokemon,
    hasNextPage,
    hasPreviousPage,
    searchPokemon,
    filterByTypes,
    sortPokemon,
    goToPage,
    selectPokemon,
    clearSelection,
    clearAllFilters,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Custom hooks for specific functionality
export const usePokemonData = () => {
  const { state, dispatch } = useAppContext();
  
  return {
    pokemon: state.pokemon,
    filteredPokemon: state.filteredPokemon,
    selectedPokemon: state.selectedPokemon,
    availableTypes: state.availableTypes,
    loading: state.pokemonLoading,
    error: state.pokemonError,
    loadPokemon: useCallback(() => {
      dispatch({ type: 'LOAD_POKEMON_START' });
    }, [dispatch]),
    loadPokemonSuccess: useCallback((pokemon: Pokemon[], types: PokemonType[]) => {
      dispatch({ type: 'LOAD_POKEMON_SUCCESS', payload: { pokemon, types } });
    }, [dispatch]),
    loadPokemonError: useCallback((error: string) => {
      dispatch({ type: 'LOAD_POKEMON_ERROR', payload: error });
    }, [dispatch]),
  };
};

export const usePokemonDetail = () => {
  const { state, dispatch, selectPokemon, clearSelection } = useAppContext();
  
  return {
    selectedPokemon: state.selectedPokemon,
    loading: state.detailLoading,
    error: state.detailError,
    selectPokemon,
    clearSelection,
    loadDetailStart: useCallback(() => {
      dispatch({ type: 'LOAD_POKEMON_DETAIL_START' });
    }, [dispatch]),
    loadDetailError: useCallback((error: string) => {
      dispatch({ type: 'LOAD_POKEMON_DETAIL_ERROR', payload: error });
    }, [dispatch]),
  };
};

export const useSearch = () => {
  const { state, searchPokemon } = useAppContext();
  
  return {
    searchQuery: state.searchQuery,
    searchPokemon,
  };
};

export const useFilters = () => {
  const { state, dispatch, filterByTypes, clearAllFilters } = useAppContext();
  
  return {
    selectedTypes: state.selectedTypes,
    availableTypes: state.availableTypes,
    showFilters: state.showFilters,
    filterByTypes,
    clearAllFilters,
    addTypeFilter: useCallback((type: PokemonType) => {
      dispatch({ type: 'ADD_TYPE_FILTER', payload: type });
    }, [dispatch]),
    removeTypeFilter: useCallback((type: PokemonType) => {
      dispatch({ type: 'REMOVE_TYPE_FILTER', payload: type });
    }, [dispatch]),
    toggleFilters: useCallback(() => {
      dispatch({ type: 'TOGGLE_FILTERS' });
    }, [dispatch]),
    setShowFilters: useCallback((show: boolean) => {
      dispatch({ type: 'SET_SHOW_FILTERS', payload: show });
    }, [dispatch]),
  };
};

export const usePagination = () => {
  const { 
    state, 
    dispatch, 
    totalPages, 
    currentPagePokemon, 
    hasNextPage, 
    hasPreviousPage, 
    goToPage 
  } = useAppContext();
  
  return {
    currentPage: state.currentPage,
    itemsPerPage: state.itemsPerPage,
    totalItems: state.totalItems,
    totalPages,
    currentPagePokemon,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    setItemsPerPage: useCallback((itemsPerPage: number) => {
      dispatch({ type: 'SET_ITEMS_PER_PAGE', payload: itemsPerPage });
    }, [dispatch]),
    nextPage: useCallback(() => {
      if (hasNextPage) {
        goToPage(state.currentPage + 1);
      }
    }, [hasNextPage, goToPage, state.currentPage]),
    previousPage: useCallback(() => {
      if (hasPreviousPage) {
        goToPage(state.currentPage - 1);
      }
    }, [hasPreviousPage, goToPage, state.currentPage]),
  };
};

export const useSorting = () => {
  const { state, sortPokemon } = useAppContext();
  
  return {
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    sortPokemon,
  };
};

export const useUI = () => {
  const { state, dispatch } = useAppContext();
  
  return {
    viewMode: state.viewMode,
    showFilters: state.showFilters,
    setViewMode: useCallback((viewMode: AppState['viewMode']) => {
      dispatch({ type: 'SET_VIEW_MODE', payload: viewMode });
    }, [dispatch]),
    toggleFilters: useCallback(() => {
      dispatch({ type: 'TOGGLE_FILTERS' });
    }, [dispatch]),
  };
};

export const useNavigation = () => {
  const { state, dispatch } = useAppContext();
  
  return {
    currentRoute: state.currentRoute,
    previousRoute: state.previousRoute,
    setCurrentRoute: useCallback((route: string) => {
      dispatch({ type: 'SET_CURRENT_ROUTE', payload: route });
    }, [dispatch]),
  };
};