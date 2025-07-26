import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePokemonData, useFilters, usePagination, useUI } from '../contexts';
import { useRouteSync } from '../hooks/useRouteSync';
import { PokemonService } from '../services/PokemonService';
import { FilterBar } from '../components/filters/FilterBar';
import { PokemonGrid } from '../components/pokemon/PokemonGrid';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { NoResults } from '../components/ui/NoResults';

const PokemonListPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    pokemon,
    filteredPokemon,
    availableTypes,
    loading,
    error,
    loadPokemon,
    loadPokemonSuccess,
    loadPokemonError
  } = usePokemonData();

  const {
    selectedTypes,
    filterByTypes,
    clearAllFilters
  } = useFilters();

  const {
    currentPagePokemon,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    hasNextPage,
    hasPreviousPage
  } = usePagination();

  const { viewMode, setViewMode } = useUI();

  const {
    navigateToPokemonDetail,
    searchParams,
    isHomePage,
    isPokemonListPage
  } = useRouteSync();

  const searchQuery = searchParams.get('q') || '';

  // Load Pokemon data on mount
  useEffect(() => {
    const loadData = async () => {
      if (pokemon.length === 0) {
        loadPokemon();
        try {
          const pokemonService = new PokemonService();
          const data = await pokemonService.loadPokemon();
          const types = await pokemonService.getAvailableTypes();
          loadPokemonSuccess(data, types);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load Pokemon data';
          loadPokemonError(errorMessage);
        }
      }
    };

    loadData();
  }, [pokemon.length, loadPokemon, loadPokemonSuccess, loadPokemonError]);

  const handlePokemonClick = (pokemonId: number) => {
    navigateToPokemonDetail(pokemonId);
  };

  const handleSearchChange = (query: string) => {
    // Search is handled by useRouteSync hook
    const params = new URLSearchParams(searchParams);
    if (query.trim()) {
      params.set('q', query.trim());
    } else {
      params.delete('q');
    }
    params.delete('page'); // Reset to first page
    
    const newSearch = params.toString();
    window.history.replaceState(null, '', newSearch ? `?${newSearch}` : window.location.pathname);
  };

  const handleTypesChange = (types: typeof selectedTypes) => {
    filterByTypes(types);
  };

  const handleClearAllFilters = () => {
    clearAllFilters();
  };

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  if (loading && pokemon.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorMessage
          error={error}
          onRetry={() => window.location.reload()}
          showRetryButton={true}
        />
      </div>
    );
  }

  const hasActiveFilters = searchQuery.trim() || selectedTypes.length > 0;
  const showNoResults = !loading && filteredPokemon.length === 0 && hasActiveFilters;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Pokédex
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Discover and explore Pokémon from the Kanto region
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`
              p-2 rounded-lg transition-colors duration-200
              ${viewMode === 'grid'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }
            `}
            aria-label="Grid view"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`
              p-2 rounded-lg transition-colors duration-200
              ${viewMode === 'list'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }
            `}
            aria-label="List view"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        availableTypes={availableTypes}
        selectedTypes={selectedTypes}
        onTypesChange={handleTypesChange}
        onClearAll={handleClearAllFilters}
        showResultsCount={true}
        resultsCount={totalItems}
        loading={loading}
      />

      {/* Content */}
      {showNoResults ? (
        <NoResults
          searchQuery={searchQuery}
          selectedTypes={selectedTypes.map(t => t.name)}
          onClearSearch={() => handleSearchChange('')}
          onClearFilters={handleClearAllFilters}
          showSuggestions={true}
        />
      ) : (
        <>
          {/* Pokemon Grid */}
          <PokemonGrid
            pokemon={currentPagePokemon}
            onPokemonClick={handlePokemonClick}
            loading={loading}
            viewMode={viewMode}
            className="min-h-[400px]"
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 py-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPreviousPage}
                className="
                  px-3 py-2 text-sm font-medium
                  text-gray-500 bg-white border border-gray-300 rounded-md
                  hover:bg-gray-50 hover:text-gray-700
                  disabled:opacity-50 disabled:cursor-not-allowed
                  dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400
                  dark:hover:bg-gray-700 dark:hover:text-gray-300
                  transition-colors duration-200
                "
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));
                  const isActive = pageNum === currentPage;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`
                        px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                        ${isActive
                          ? 'text-white bg-blue-600 border border-blue-600'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                        }
                      `}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
                className="
                  px-3 py-2 text-sm font-medium
                  text-gray-500 bg-white border border-gray-300 rounded-md
                  hover:bg-gray-50 hover:text-gray-700
                  disabled:opacity-50 disabled:cursor-not-allowed
                  dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400
                  dark:hover:bg-gray-700 dark:hover:text-gray-300
                  transition-colors duration-200
                "
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PokemonListPage;