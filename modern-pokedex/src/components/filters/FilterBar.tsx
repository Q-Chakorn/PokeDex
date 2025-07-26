import React from 'react';
import { useTranslation } from 'react-i18next';
import { SearchInput } from '../search/SearchInput';
import { TypeFilter } from './TypeFilter';
import type { PokemonType } from '../../types/pokemon';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  availableTypes: PokemonType[];
  selectedTypes: PokemonType[];
  onTypesChange: (types: PokemonType[]) => void;
  onClearAll?: () => void;
  className?: string;
  layout?: 'horizontal' | 'vertical';
  showResultsCount?: boolean;
  resultsCount?: number;
  loading?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  availableTypes,
  selectedTypes,
  onTypesChange,
  onClearAll,
  className = '',
  layout = 'horizontal',
  showResultsCount = true,
  resultsCount = 0,
  loading = false
}) => {
  const { t } = useTranslation();

  const hasActiveFilters = searchQuery.trim() || selectedTypes.length > 0;

  const handleClearAll = () => {
    onSearchChange('');
    onTypesChange([]);
    if (onClearAll) {
      onClearAll();
    }
  };

  const layoutClasses = {
    horizontal: 'flex flex-col sm:flex-row gap-4 sm:items-center',
    vertical: 'flex flex-col gap-4'
  };

  return (
    <div className={`${className}`}>
      {/* Main Filter Controls */}
      <div className={layoutClasses[layout]}>
        {/* Search Input */}
        <div className="flex-1 min-w-0">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder={t('search.placeholder')}
            className="w-full"
            disabled={loading}
          />
        </div>

        {/* Type Filter */}
        <div className="w-full sm:w-64">
          <TypeFilter
            availableTypes={availableTypes}
            selectedTypes={selectedTypes}
            onTypesChange={onTypesChange}
            disabled={loading}
            className="w-full"
          />
        </div>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            disabled={loading}
            className="
              px-4 py-2 text-sm font-medium
              text-gray-600 dark:text-gray-400
              hover:text-gray-800 dark:hover:text-gray-200
              border border-gray-300 dark:border-gray-600
              rounded-lg
              hover:bg-gray-50 dark:hover:bg-gray-700
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              whitespace-nowrap
            "
          >
            {t('filters.clearAll')}
          </button>
        )}
      </div>

      {/* Results Summary */}
      {showResultsCount && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Results Count */}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {loading ? (
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  <span>{t('loading.pokemon')}</span>
                </span>
              ) : (
                <>
                  {resultsCount} {resultsCount === 1 ? 'Pokémon' : 'Pokémon'} found
                </>
              )}
            </span>

            {/* Active Filters Summary */}
            {hasActiveFilters && !loading && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>•</span>
                <div className="flex items-center space-x-1">
                  {searchQuery.trim() && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Search: "{searchQuery.trim()}"
                    </span>
                  )}
                  
                  {selectedTypes.length > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {selectedTypes.length} type{selectedTypes.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Clear */}
          {hasActiveFilters && !loading && (
            <button
              onClick={handleClearAll}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};