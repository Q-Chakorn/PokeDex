import React from 'react';
import { useTranslation } from 'react-i18next';

interface NoResultsProps {
  searchQuery?: string;
  selectedTypes?: string[];
  onClearFilters?: () => void;
  onClearSearch?: () => void;
  className?: string;
  showSuggestions?: boolean;
  customMessage?: string;
  customIcon?: React.ReactNode;
}

export const NoResults: React.FC<NoResultsProps> = ({
  searchQuery,
  selectedTypes = [],
  onClearFilters,
  onClearSearch,
  className = '',
  showSuggestions = true,
  customMessage,
  customIcon
}) => {
  const { t } = useTranslation();

  const hasSearchQuery = searchQuery && searchQuery.trim().length > 0;
  const hasTypeFilters = selectedTypes.length > 0;
  const hasAnyFilters = hasSearchQuery || hasTypeFilters;

  const getTitle = () => {
    if (customMessage) return customMessage;
    
    if (hasSearchQuery && hasTypeFilters) {
      return t('noResults.searchAndFilter', { 
        query: searchQuery.trim(),
        count: selectedTypes.length 
      });
    } else if (hasSearchQuery) {
      return t('noResults.search', { query: searchQuery.trim() });
    } else if (hasTypeFilters) {
      return t('noResults.filter', { count: selectedTypes.length });
    } else {
      return t('noResults.general');
    }
  };

  const getDescription = () => {
    if (hasAnyFilters) {
      return t('noResults.tryDifferentFilters');
    } else {
      return t('noResults.noDataAvailable');
    }
  };

  const defaultIcon = (
    <svg
      className="w-16 h-16 text-gray-300 dark:text-gray-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  const suggestions = [
    t('noResults.suggestions.checkSpelling'),
    t('noResults.suggestions.tryDifferentKeywords'),
    t('noResults.suggestions.removeFilters'),
    t('noResults.suggestions.browseAllPokemon')
  ];

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {/* Icon */}
      <div className="mb-6">
        {customIcon || defaultIcon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {getTitle()}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        {getDescription()}
      </p>

      {/* Action Buttons */}
      {hasAnyFilters && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {hasSearchQuery && onClearSearch && (
            <button
              onClick={onClearSearch}
              className="
                px-4 py-2 text-sm font-medium
                text-blue-600 dark:text-blue-400
                hover:text-blue-700 dark:hover:text-blue-300
                border border-blue-300 dark:border-blue-600
                rounded-lg
                hover:bg-blue-50 dark:hover:bg-blue-900/20
                transition-all duration-200
              "
            >
              {t('noResults.clearSearch')}
            </button>
          )}
          
          {hasTypeFilters && onClearFilters && (
            <button
              onClick={onClearFilters}
              className="
                px-4 py-2 text-sm font-medium
                text-green-600 dark:text-green-400
                hover:text-green-700 dark:hover:text-green-300
                border border-green-300 dark:border-green-600
                rounded-lg
                hover:bg-green-50 dark:hover:bg-green-900/20
                transition-all duration-200
              "
            >
              {t('noResults.clearFilters')}
            </button>
          )}
          
          {(hasSearchQuery || hasTypeFilters) && onClearFilters && onClearSearch && (
            <button
              onClick={() => {
                onClearSearch();
                onClearFilters();
              }}
              className="
                px-4 py-2 text-sm font-medium
                text-gray-600 dark:text-gray-400
                hover:text-gray-700 dark:hover:text-gray-300
                border border-gray-300 dark:border-gray-600
                rounded-lg
                hover:bg-gray-50 dark:hover:bg-gray-700
                transition-all duration-200
              "
            >
              {t('noResults.clearAll')}
            </button>
          )}
        </div>
      )}

      {/* Suggestions */}
      {showSuggestions && hasAnyFilters && (
        <div className="max-w-md">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t('noResults.suggestions.title')}
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-400 dark:text-gray-500 mr-2">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};