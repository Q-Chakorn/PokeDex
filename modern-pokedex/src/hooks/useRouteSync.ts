import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import type { PokemonType } from '../types/pokemon';

/**
 * Hook to synchronize URL search params with application state
 */
export const useRouteSync = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { state, dispatch, searchPokemon, filterByTypes, goToPage, sortPokemon } = useAppContext();

  // Sync URL params to state on mount and location change
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const types = searchParams.get('types')?.split(',').filter(Boolean) || [];
    const page = parseInt(searchParams.get('page') || '1', 10);
    const sortBy = (searchParams.get('sortBy') as any) || 'id';
    const sortOrder = (searchParams.get('sortOrder') as any) || 'asc';

    // Update state if different from URL
    if (query !== state.searchQuery) {
      searchPokemon(query);
    }

    if (types.length > 0) {
      const typeObjects: PokemonType[] = types.map(typeName => ({
        name: typeName,
        color: getTypeColor(typeName)
      }));
      
      if (!arraysEqual(typeObjects.map(t => t.name), state.selectedTypes.map(t => t.name))) {
        filterByTypes(typeObjects);
      }
    }

    if (page !== state.currentPage) {
      goToPage(page);
    }

    if (sortBy !== state.sortBy || sortOrder !== state.sortOrder) {
      sortPokemon(sortBy, sortOrder);
    }
  }, [location.search]);

  // Sync state to URL params
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    if (state.searchQuery.trim()) {
      params.set('q', state.searchQuery.trim());
    }

    if (state.selectedTypes.length > 0) {
      params.set('types', state.selectedTypes.map(t => t.name).join(','));
    }

    if (state.currentPage > 1) {
      params.set('page', state.currentPage.toString());
    }

    if (state.sortBy !== 'id') {
      params.set('sortBy', state.sortBy);
    }

    if (state.sortOrder !== 'asc') {
      params.set('sortOrder', state.sortOrder);
    }

    const newSearch = params.toString();
    const currentSearch = location.search.substring(1);

    if (newSearch !== currentSearch) {
      navigate({
        pathname: location.pathname,
        search: newSearch ? `?${newSearch}` : ''
      }, { replace: true });
    }
  }, [
    state.searchQuery,
    state.selectedTypes,
    state.currentPage,
    state.sortBy,
    state.sortOrder,
    location.pathname,
    location.search,
    navigate
  ]);

  // Update URL when state changes
  useEffect(() => {
    updateURL();
  }, [updateURL]);

  // Navigation helpers
  const navigateToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const navigateToPokemonList = useCallback((params?: URLSearchParams) => {
    const search = params?.toString();
    navigate({
      pathname: '/pokemon',
      search: search ? `?${search}` : ''
    });
  }, [navigate]);

  const navigateToPokemonDetail = useCallback((pokemonId: number | string) => {
    navigate(`/pokemon/${pokemonId}`);
  }, [navigate]);

  const navigateBack = useCallback(() => {
    if (state.previousRoute) {
      navigate(state.previousRoute);
    } else {
      navigate(-1);
    }
  }, [navigate, state.previousRoute]);

  return {
    // Current route info
    pathname: location.pathname,
    search: location.search,
    searchParams,
    
    // Navigation functions
    navigateToHome,
    navigateToPokemonList,
    navigateToPokemonDetail,
    navigateBack,
    
    // URL sync
    updateURL,
    
    // Route state
    isHomePage: location.pathname === '/',
    isPokemonListPage: location.pathname === '/pokemon',
    isPokemonDetailPage: location.pathname.startsWith('/pokemon/'),
  };
};

// Helper function to get type color (simplified)
const getTypeColor = (typeName: string): string => {
  const typeColors: Record<string, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
  };
  
  return typeColors[typeName] || '#68A090';
};

// Helper function to compare arrays
const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
};