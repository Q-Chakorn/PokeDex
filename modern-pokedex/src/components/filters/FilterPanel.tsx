import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PokemonType } from '../../types/pokemon';
import { TypeBadge } from '../ui/TypeBadge';

interface FilterPanelProps {
  availableTypes: PokemonType[];
  selectedTypes: PokemonType[];
  onTypesChange: (types: PokemonType[]) => void;
  onClearAll?: () => void;
  className?: string;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
  maxVisibleTypes?: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  availableTypes,
  selectedTypes,
  onTypesChange,
  onClearAll,
  className = '',
  isCollapsible = true,
  defaultExpanded = true,
  maxVisibleTypes = 9
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showAllTypes, setShowAllTypes] = useState(false);

  const displayedTypes = showAllTypes 
    ? availableTypes 
    : availableTypes.slice(0, maxVisibleTypes);

  const hasMoreTypes = availableTypes.length > maxVisibleTypes;

  const handleTypeToggle = (type: PokemonType) => {
    const isSelected = selectedTypes.some(selected => selected.name === type.name);
    
    if (isSelected) {
      // Remove type
      const newTypes = selectedTypes.filter(selected => selected.name !== type.name);
      onTypesChange(newTypes);
    } else {
      // Add type
      onTypesChange([...selectedTypes, type]);
    }
  };

  const handleClearAll = () => {
    onTypesChange([]);
    if (onClearAll) {
      onClearAll();
    }
  };

  const isTypeSelected = (type: PokemonType) => {
    return selectedTypes.some(selected => selected.name === type.name);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('filters.title')}
          </h3>
          {selectedTypes.length > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {selectedTypes.length}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {selectedTypes.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
            >
              {t('filters.clearAll')}
            </button>
          )}
          
          {isCollapsible && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
              aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
            >
              <svg
                className={`w-5 h-5 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {(!isCollapsible || isExpanded) && (
        <div className="p-4">
          {/* Type Filter Section */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('filters.type')}
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {displayedTypes.map((type) => (
                <button
                  key={type.name}
                  onClick={() => handleTypeToggle(type)}
                  className={`
                    relative p-2 rounded-lg border-2 transition-all duration-200
                    ${isTypeSelected(type)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  `}
                  aria-pressed={isTypeSelected(type)}
                  aria-label={`${isTypeSelected(type) ? 'Remove' : 'Add'} ${t(`types.${type.name}`)} filter`}
                >
                  <TypeBadge
                    type={type}
                    size="sm"
                    variant={isTypeSelected(type) ? 'filled' : 'outlined'}
                    className="w-full justify-center"
                  />
                  
                  {/* Selection indicator */}
                  {isTypeSelected(type) && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Show More/Less Button */}
            {hasMoreTypes && (
              <button
                onClick={() => setShowAllTypes(!showAllTypes)}
                className="mt-3 w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
              >
                {showAllTypes ? t('filters.showLess') : t('filters.showAll')}
                <svg
                  className={`inline-block w-4 h-4 ml-1 transform transition-transform duration-200 ${showAllTypes ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Selected Types Summary */}
          {selectedTypes.length > 0 && (
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Selected Types ({selectedTypes.length})
                </span>
                <button
                  onClick={handleClearAll}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  Clear all
                </button>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {selectedTypes.map((type) => (
                  <button
                    key={type.name}
                    onClick={() => handleTypeToggle(type)}
                    className="group relative"
                    aria-label={`Remove ${t(`types.${type.name}`)} filter`}
                  >
                    <TypeBadge
                      type={type}
                      size="sm"
                      className="pr-6 group-hover:opacity-80 transition-opacity duration-200"
                    />
                    <div className="absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-black bg-opacity-20 flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-200">
                      <svg
                        className="w-2 h-2 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};