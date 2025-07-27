import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemon } from '../contexts/SimplePokemonContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EnhancedSearchBar } from '../components/ui/EnhancedSearchBar';
import { PokemonImage } from '../components/ui/PokemonImage';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
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

  const handlePokemonClick = (pokemon: any) => {
    // Extract number from dexNumber (e.g., "#0001" -> "1")
    const dexNum = pokemon.dexNumber.replace('#', '').replace(/^0+/, '');
    navigate(`/pokemon/${dexNum}`);
  };

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
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f7',
      color: '#1d1d1f'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{
            fontSize: '1.25rem',
            color: '#86868b',
            maxWidth: '40rem',
            margin: '0 auto',
            lineHeight: '1.5',
            fontWeight: '400'
          }}>
            Discover all 151 Pokémon from the Kanto region with detailed stats, types, and abilities.
          </p>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#e8e8ed',
              borderRadius: '12px',
              padding: '4px'
            }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  backgroundColor: viewMode === 'grid' ? '#ffffff' : 'transparent',
                  color: viewMode === 'grid' ? '#1d1d1f' : '#86868b',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <svg style={{ width: '16px', height: '16px', marginRight: '6px' }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  backgroundColor: viewMode === 'list' ? '#ffffff' : 'transparent',
                  color: viewMode === 'list' ? '#1d1d1f' : '#86868b',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <svg style={{ width: '16px', height: '16px', marginRight: '6px' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                List
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e8e8ed'
        }}>
          {/* Apple-style Search */}
          <div className="mb-8 sm:mb-12">
            <div className="max-w-md mx-auto px-2 sm:px-4">
              <EnhancedSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search Pokémon"
                resultsCount={filteredPokemon.length}
                className="w-full"
                showResultsIndicator={false}
              />
            </div>
          </div>

          {/* Type Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '15px', fontWeight: '500', color: '#1d1d1f', marginRight: '12px' }}>Filter by type:</span>
            {availableTypes.slice(0, 8).map((type) => {
              const isSelected = selectedTypes.some(t => t.name === type.name);
              return (
                <button
                  key={type.name}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedTypes(selectedTypes.filter(t => t.name !== type.name));
                    } else {
                      setSelectedTypes([...selectedTypes, type]);
                    }
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    backgroundColor: isSelected ? type.color : '#f2f2f7',
                    color: isSelected ? 'white' : '#1d1d1f',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {type.name}
                </button>
              );
            })}

            {(searchQuery || selectedTypes.length > 0) && (
              <button
                onClick={clearFilters}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#ff3b30',
                  backgroundColor: '#fff2f2',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Results Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '15px',
            color: '#86868b'
          }}>
            <div>
              <span style={{ fontWeight: '500', color: '#1d1d1f' }}>{filteredPokemon.length}</span> Pokémon found
              {selectedTypes.length > 0 && (
                <span style={{ marginLeft: '8px' }}>
                  • Filtered by: {selectedTypes.map(t => t.name).join(', ')}
                </span>
              )}
            </div>

            <div style={{
              backgroundColor: '#f2f2f7',
              color: '#1d1d1f',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Page {currentPage} of {Math.ceil(filteredPokemon.length / itemsPerPage)}
            </div>
          </div>
        </div>

        {/* Pokemon Grid */}
        <div className={`pokemon-grid ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
          {currentPagePokemon.map((pokemon) => (
            <div 
              key={pokemon.id} 
              className="pokemon-card"
              onClick={() => handlePokemonClick(pokemon)}
            >
              {/* Legendary Badge */}
              {pokemon.isLegendary && (
                <div className="pokemon-legendary-badge">
                  ✨ Legendary
                </div>
              )}

              {/* Pokemon Number */}
              <div className="pokemon-number">
                {pokemon.dexNumber}
              </div>

              {/* Pokemon Avatar */}
              <PokemonImage
                dexNumber={pokemon.dexNumber}
                name={pokemon.name}
                primaryType={pokemon.types[0]?.name}
                size="medium"
                className="pokemon-avatar"
                style={{
                  margin: '0 auto 1.25rem'
                }}
              />

              {/* Pokemon Info Container (for list view) */}
              <div className="pokemon-info">
                {/* Pokemon Name */}
                <h3 className="pokemon-name">
                  {pokemon.name}
                </h3>

                {/* Types */}
                <div className="pokemon-types">
                  {pokemon.types.map((type) => (
                    <span
                      key={type.name}
                      className="pokemon-type-badge"
                      style={{ backgroundColor: type.color }}
                    >
                      {type.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="pokemon-stats">
                <div className="pokemon-stat hp">
                  <div className="pokemon-stat-label">HP</div>
                  <div className="pokemon-stat-value">{pokemon.stats.hp}</div>
                </div>
                <div className="pokemon-stat attack">
                  <div className="pokemon-stat-label">ATK</div>
                  <div className="pokemon-stat-value">{pokemon.stats.attack}</div>
                </div>
                <div className="pokemon-stat defense">
                  <div className="pokemon-stat-label">DEF</div>
                  <div className="pokemon-stat-value">{pokemon.stats.defense}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredPokemon.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px',
                backgroundColor: '#f2f2f7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg style={{ width: '32px', height: '32px', color: '#86868b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1d1d1f',
                marginBottom: '12px'
              }}>
                No Pokémon found
              </h3>
              <p style={{
                fontSize: '17px',
                color: '#86868b',
                marginBottom: '32px',
                lineHeight: '1.5'
              }}>
                We couldn't find any Pokémon matching your search criteria. Try adjusting your filters or search terms.
              </p>

              <button
                onClick={clearFilters}
                style={{
                  padding: '12px 24px',
                  fontSize: '17px',
                  fontWeight: '500',
                  color: '#ffffff',
                  backgroundColor: '#007aff',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#0056cc';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#007aff';
                }}
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e8e8ed',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '12px',
                  color: currentPage === 1 ? '#86868b' : '#1d1d1f',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#f2f2f7';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                }}
              >
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div style={{ display: 'flex', gap: '4px' }}>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    // If total pages is 5 or less, show all pages
                    pageNum = i + 1;
                  } else {
                    // For more than 5 pages, show 5 pages around current page
                    const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                    pageNum = startPage + i;
                  }
                  const isActive = pageNum === currentPage;

                  return (
                    <button
                      key={`page-${i}-${pageNum}`}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        width: '40px',
                        height: '40px',
                        fontSize: '15px',
                        fontWeight: '500',
                        borderRadius: '12px',
                        transition: 'all 0.2s ease',
                        backgroundColor: isActive ? '#007aff' : 'transparent',
                        color: isActive ? '#ffffff' : '#1d1d1f',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          (e.target as HTMLButtonElement).style.backgroundColor = '#f2f2f7';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '12px',
                  color: currentPage === totalPages ? '#86868b' : '#1d1d1f',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#f2f2f7';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                }}
              >
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;