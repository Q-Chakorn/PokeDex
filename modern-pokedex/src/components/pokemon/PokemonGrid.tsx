import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Pokemon } from '../../types/pokemon';
import { PokemonCard } from './PokemonCard';
import { PokemonCardSkeleton } from './PokemonCardSkeleton';
import { NoResultsState } from '../ui/EmptyState';
import { ErrorMessage } from '../ui/ErrorMessage';

interface PokemonGridProps {
  pokemon: Pokemon[];
  loading?: boolean;
  error?: string | null;
  onPokemonClick?: (pokemon: Pokemon) => void;
  onRetry?: () => void;
  onClearFilters?: () => void;
  className?: string;
  cardSize?: 'sm' | 'md' | 'lg';
  showStats?: boolean;
  skeletonCount?: number;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const PokemonGrid: React.FC<PokemonGridProps> = ({
  pokemon,
  loading = false,
  error = null,
  onPokemonClick,
  onRetry,
  onClearFilters,
  className = '',
  cardSize = 'md',
  showStats = false,
  skeletonCount = 12,
  columns = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4
  }
}) => {
  const { t } = useTranslation();

  // Generate responsive grid classes based on columns configuration
  const gridClasses = useMemo(() => {
    const classes = ['grid', 'gap-6'];
    
    if (columns.sm) classes.push(`grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
    
    return classes.join(' ');
  }, [columns]);

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array.from({ length: skeletonCount }, (_, index) => (
      <PokemonCardSkeleton
        key={`skeleton-${index}`}
        size={cardSize}
        showStats={showStats}
      />
    ));
  };

  // Render Pokemon cards
  const renderPokemonCards = () => {
    return pokemon.map((poke) => (
      <PokemonCard
        key={poke.id}
        pokemon={poke}
        onClick={onPokemonClick}
        size={cardSize}
        showStats={showStats}
      />
    ));
  };

  // Handle error state
  if (error && !loading) {
    return (
      <div className={`w-full ${className}`}>
        <ErrorMessage
          title={t('error.loadingFailed')}
          message={error}
          variant="error"
          onRetry={onRetry}
          className="max-w-md mx-auto"
        />
      </div>
    );
  }

  // Handle empty state (no Pokemon found)
  if (!loading && !error && pokemon.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <NoResultsState onClearFilters={onClearFilters} />
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className={gridClasses}>
        {loading ? renderSkeletons() : renderPokemonCards()}
      </div>
      
      {/* Loading more indicator */}
      {loading && pokemon.length > 0 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">{t('loading.pokemon')}</span>
          </div>
        </div>
      )}
    </div>
  );
};