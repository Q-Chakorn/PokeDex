import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Pokemon } from '../../types/pokemon';
import { PokemonGrid } from './PokemonGrid';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}) => {
  const { t } = useTranslation();

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <nav className={`flex items-center justify-center space-x-2 ${className}`} aria-label="Pagination">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md
          hover:bg-gray-50 hover:text-gray-700
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500
          dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300
          transition-colors duration-200
        "
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page numbers */}
      {visiblePages.map((page, index) => {
        if (page === '...') {
          return (
            <span
              key={`dots-${index}`}
              className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              ...
            </span>
          );
        }

        const pageNumber = page as number;
        const isActive = pageNumber === currentPage;

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`
              px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
              ${isActive
                ? 'bg-blue-600 text-white border border-blue-600'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
              }
            `}
            aria-label={`Page ${pageNumber}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md
          hover:bg-gray-50 hover:text-gray-700
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500
          dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300
          transition-colors duration-200
        "
        aria-label="Next page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
};

interface PaginatedPokemonGridProps {
  pokemon: Pokemon[];
  loading?: boolean;
  error?: string | null;
  onPokemonClick?: (pokemon: Pokemon) => void;
  onRetry?: () => void;
  onClearFilters?: () => void;
  className?: string;
  cardSize?: 'sm' | 'md' | 'lg';
  showStats?: boolean;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const PaginatedPokemonGrid: React.FC<PaginatedPokemonGridProps> = ({
  pokemon,
  loading = false,
  error = null,
  onPokemonClick,
  onRetry,
  onClearFilters,
  className = '',
  cardSize = 'md',
  showStats = false,
  itemsPerPage = 20,
  currentPage = 1,
  onPageChange,
  columns
}) => {
  const { t } = useTranslation();

  // Calculate pagination
  const { paginatedPokemon, totalPages } = useMemo(() => {
    if (pokemon.length === 0) {
      return { paginatedPokemon: [], totalPages: 0 };
    }

    const total = Math.ceil(pokemon.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = pokemon.slice(startIndex, endIndex);

    return { paginatedPokemon: paginated, totalPages: total };
  }, [pokemon, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Pokemon Grid */}
      <PokemonGrid
        pokemon={paginatedPokemon}
        loading={loading}
        error={error}
        onPokemonClick={onPokemonClick}
        onRetry={onRetry}
        onClearFilters={onClearFilters}
        cardSize={cardSize}
        showStats={showStats}
        columns={columns}
      />

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          
          {/* Results info */}
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('search.showing', {
              start: (currentPage - 1) * itemsPerPage + 1,
              end: Math.min(currentPage * itemsPerPage, pokemon.length),
              total: pokemon.length
            }) || `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, pokemon.length)} of ${pokemon.length} Pokémon`}
          </div>
        </div>
      )}
    </div>
  );
};