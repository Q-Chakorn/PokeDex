import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Pokemon } from '../../types/pokemon';
import { PokemonCard } from './PokemonCard';
import { PokemonCardSkeleton } from './PokemonCardSkeleton';
import { NoResultsState } from '../ui/EmptyState';
import { ErrorMessage } from '../ui/ErrorMessage';

interface VirtualizedPokemonGridProps {
  pokemon: Pokemon[];
  loading?: boolean;
  error?: string | null;
  onPokemonClick?: (pokemon: Pokemon) => void;
  onRetry?: () => void;
  onClearFilters?: () => void;
  className?: string;
  cardSize?: 'sm' | 'md' | 'lg';
  showStats?: boolean;
  itemHeight?: number;
  overscan?: number;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const VirtualizedPokemonGrid: React.FC<VirtualizedPokemonGridProps> = ({
  pokemon,
  loading = false,
  error = null,
  onPokemonClick,
  onRetry,
  onClearFilters,
  className = '',
  cardSize = 'md',
  showStats = false,
  itemHeight = 280,
  overscan = 5,
  columns = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4
  }
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [scrollTop, setScrollTop] = useState(0);
  const [currentColumns, setCurrentColumns] = useState(columns.md || 2);

  // Update container height on resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerHeight(Math.max(400, window.innerHeight - rect.top - 100));
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Update columns based on screen size
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1280 && columns.xl) {
        setCurrentColumns(columns.xl);
      } else if (width >= 1024 && columns.lg) {
        setCurrentColumns(columns.lg);
      } else if (width >= 768 && columns.md) {
        setCurrentColumns(columns.md);
      } else if (columns.sm) {
        setCurrentColumns(columns.sm);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [columns]);

  // Calculate virtual scrolling parameters
  const virtualItems = useMemo(() => {
    if (pokemon.length === 0) return [];

    const rowCount = Math.ceil(pokemon.length / currentColumns);
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
      rowCount - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight)
    );

    const startIndex = Math.max(0, visibleStart - overscan);
    const endIndex = Math.min(rowCount - 1, visibleEnd + overscan);

    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const startPokemonIndex = i * currentColumns;
      const endPokemonIndex = Math.min(startPokemonIndex + currentColumns, pokemon.length);
      const rowPokemon = pokemon.slice(startPokemonIndex, endPokemonIndex);

      items.push({
        index: i,
        top: i * itemHeight,
        pokemon: rowPokemon
      });
    }

    return items;
  }, [pokemon, currentColumns, scrollTop, containerHeight, itemHeight, overscan]);

  const totalHeight = Math.ceil(pokemon.length / currentColumns) * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Generate responsive grid classes
  const gridClasses = useMemo(() => {
    const classes = ['grid', 'gap-6'];
    
    if (columns.sm) classes.push(`grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
    
    return classes.join(' ');
  }, [columns]);

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

  // Handle empty state
  if (!loading && !error && pokemon.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <NoResultsState onClearFilters={onClearFilters} />
      </div>
    );
  }

  // Handle loading state
  if (loading && pokemon.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className={gridClasses}>
          {Array.from({ length: 12 }, (_, index) => (
            <PokemonCardSkeleton
              key={`skeleton-${index}`}
              size={cardSize}
              showStats={showStats}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={containerRef}
        className="relative overflow-auto"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {virtualItems.map((item) => (
            <div
              key={item.index}
              className={gridClasses}
              style={{
                position: 'absolute',
                top: item.top,
                left: 0,
                right: 0,
                height: itemHeight
              }}
            >
              {item.pokemon.map((poke) => (
                <PokemonCard
                  key={poke.id}
                  pokemon={poke}
                  onClick={onPokemonClick}
                  size={cardSize}
                  showStats={showStats}
                />
              ))}
              
              {/* Fill empty slots in the last row */}
              {item.pokemon.length < currentColumns &&
                Array.from({ length: currentColumns - item.pokemon.length }, (_, index) => (
                  <div key={`empty-${index}`} />
                ))
              }
            </div>
          ))}
        </div>
      </div>
      
      {/* Loading more indicator */}
      {loading && pokemon.length > 0 && (
        <div className="mt-4 flex justify-center">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">{t('loading.pokemon')}</span>
          </div>
        </div>
      )}
    </div>
  );
};