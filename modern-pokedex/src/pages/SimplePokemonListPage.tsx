import React from 'react';
import { usePokemon } from '../contexts/SimplePokemonContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EnhancedSearchBar } from '../components/ui/EnhancedSearchBar';

const SimplePokemonListPage: React.FC = () => {
  const {
    filteredPokemon,
    availableTypes,
    loading,
    error,
    searchQuery,
    selectedTypes,
    currentPage,
    itemsPerPage,
    viewMode,
    setSearchQuery,
    setSelectedTypes,
    setCurrentPage,
    setViewMode,
    clearFilters
  } = usePokemon();

  // Pagination
  const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPagePokemon = filteredPokemon.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <p className="text-lg font-semibold">Error loading Pokemon data</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Pokédex
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover all 151 Pokémon from the Kanto region with detailed stats, types, and abilities.
          </p>
          
          {/* View Mode Toggle */}
          <div className="flex items-center justify-center mt-6">
            <div className="inline-flex items-center bg-white dark:bg-slate-800 rounded-xl p-1 shadow-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                List
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Apple-style Search */}
            <div className="flex-1 min-w-0">
              <div className="max-w-full sm:max-w-lg mx-auto lg:mx-0 px-1">
                <EnhancedSearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search Pokémon"
                  resultsCount={filteredPokemon.length}
                  className="w-full"
                  showResultsIndicator={true}
                />
              </div>
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center mr-2">Filter by type:</span>
              {availableTypes.slice(0, 8).map((type) => (
                <button
                  key={type.name}
                  onClick={() => {
                    const isSelected = selectedTypes.some(t => t.name === type.name);
                    if (isSelected) {
                      setSelectedTypes(selectedTypes.filter(t => t.name !== type.name));
                    } else {
                      setSelectedTypes([...selectedTypes, type]);
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                    selectedTypes.some(t => t.name === type.name)
                      ? 'text-white shadow-lg scale-105 ring-2 ring-white/30'
                      : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 shadow-sm'
                  }`}
                  style={selectedTypes.some(t => t.name === type.name) ? { backgroundColor: type.color } : {}}
                >
                  {type.name}
                </button>
              ))}
              
              {(searchQuery || selectedTypes.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 shadow-sm transform hover:scale-105 transition-all duration-200"
                >
                  ✕ Clear All
                </button>
              )}
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">{filteredPokemon.length}</span> Pokémon found
              {selectedTypes.length > 0 && (
                <span className="ml-2 text-blue-600 dark:text-blue-400">
                  • Filtered by: {selectedTypes.map(t => t.name).join(', ')}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                Page {currentPage} of {Math.ceil(filteredPokemon.length / itemsPerPage)}
              </div>
            </div>
          </div>
        </div>

        {/* Pokemon Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1 max-w-3xl mx-auto'
        }`}>
          {currentPagePokemon.map((pokemon) => (
            <div 
              key={pokemon.id} 
              className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20 dark:border-gray-700/20 overflow-hidden cursor-pointer"
            >
              {/* Background Gradient */}
              <div 
                className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${pokemon.types[0]?.color || '#68A090'} 0%, ${pokemon.types[1]?.color || pokemon.types[0]?.color || '#68A090'} 100%)`
                }}
              />
              
              <div className="relative p-6">
                {/* Pokemon Number */}
                <div className="text-xs font-mono text-gray-500 dark:text-gray-400 mb-3 text-center uppercase tracking-wider">
                  {pokemon.dexNumber}
                </div>

                {/* Pokemon Image Placeholder */}
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <div className="text-3xl">
                    {pokemon.types[0]?.name === 'Fire' && '🔥'}
                    {pokemon.types[0]?.name === 'Water' && '💧'}
                    {pokemon.types[0]?.name === 'Grass' && '🌿'}
                    {pokemon.types[0]?.name === 'Electric' && '⚡'}
                    {pokemon.types[0]?.name === 'Psychic' && '🔮'}
                    {pokemon.types[0]?.name === 'Bug' && '🐛'}
                    {pokemon.types[0]?.name === 'Normal' && '⭐'}
                    {pokemon.types[0]?.name === 'Poison' && '☠️'}
                    {pokemon.types[0]?.name === 'Flying' && '🦅'}
                    {!['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Bug', 'Normal', 'Poison', 'Flying'].includes(pokemon.types[0]?.name) && '❓'}
                  </div>
                </div>
                
                {/* Pokemon Name */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {pokemon.name}
                </h3>
                
                {/* Types */}
                <div className="flex justify-center gap-2 mb-4">
                  {pokemon.types.map((type) => (
                    <span
                      key={type.name}
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md transform group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundColor: type.color }}
                    >
                      {type.name}
                    </span>
                  ))}
                </div>

                {/* Legendary Badge */}
                {pokemon.isLegendary && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                      ✨ Legendary
                    </div>
                  </div>
                )}

                {/* Stats Preview */}
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center p-2 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
                    <div className="text-red-600 dark:text-red-400 font-semibold text-xs">HP</div>
                    <div className="font-bold text-red-700 dark:text-red-300">{pokemon.stats.hp}</div>
                  </div>
                  <div className="text-center p-2 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                    <div className="text-orange-600 dark:text-orange-400 font-semibold text-xs">ATK</div>
                    <div className="font-bold text-orange-700 dark:text-orange-300">{pokemon.stats.attack}</div>
                  </div>
                  <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                    <div className="text-blue-600 dark:text-blue-400 font-semibold text-xs">DEF</div>
                    <div className="font-bold text-blue-700 dark:text-blue-300">{pokemon.stats.defense}</div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredPokemon.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No Pokémon found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                We couldn't find any Pokémon matching your search criteria. Try adjusting your filters or search terms.
              </p>
              
              <div className="space-y-4">
                <button 
                  onClick={clearFilters} 
                  className="inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear All Filters
                </button>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  or try searching for popular Pokémon like "Pikachu", "Charizard", or "Mewtwo"
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center py-8">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-2">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));
                    const isActive = pageNum === currentPage;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-12 h-12 text-sm font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 ${
                          isActive
                            ? 'text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimplePokemonListPage;