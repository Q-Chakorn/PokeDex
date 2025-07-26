import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { PokemonType } from '../../types/pokemon';
import { TypeBadge } from '../ui/TypeBadge';

interface TypeFilterProps {
  availableTypes: PokemonType[];
  selectedTypes: PokemonType[];
  onTypesChange: (types: PokemonType[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxDisplayedTypes?: number;
}

export const TypeFilter: React.FC<TypeFilterProps> = ({
  availableTypes,
  selectedTypes,
  onTypesChange,
  placeholder,
  disabled = false,
  className = '',
  maxDisplayedTypes = 3
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const defaultPlaceholder = placeholder || t('filters.type');

  // Filter available types based on search query
  const filteredTypes = availableTypes.filter(type =>
    t(`types.${type.name}`).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleRemoveType = (typeToRemove: PokemonType) => {
    const newTypes = selectedTypes.filter(type => type.name !== typeToRemove.name);
    onTypesChange(newTypes);
  };

  const handleClearAll = () => {
    onTypesChange([]);
  };

  const isTypeSelected = (type: PokemonType) => {
    return selectedTypes.some(selected => selected.name === type.name);
  };

  const displayedSelectedTypes = selectedTypes.slice(0, maxDisplayedTypes);
  const remainingCount = selectedTypes.length - maxDisplayedTypes;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input/Trigger */}
      <div
        className={`
          min-h-[2.5rem] w-full px-3 py-2
          bg-white dark:bg-gray-800
          border border-gray-300 dark:border-gray-600
          rounded-lg cursor-pointer
          focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 dark:hover:border-gray-500'}
          transition-all duration-200
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 flex items-center flex-wrap gap-1">
            {selectedTypes.length === 0 ? (
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {defaultPlaceholder}
              </span>
            ) : (
              <>
                {displayedSelectedTypes.map((type) => (
                  <div key={type.name} className="group relative">
                    <TypeBadge
                      type={type}
                      size="sm"
                      className="pr-6 cursor-pointer"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveType(type);
                      }}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-black bg-opacity-20 flex items-center justify-center hover:bg-opacity-40 transition-all duration-200"
                      aria-label={`Remove ${t(`types.${type.name}`)} filter`}
                    >
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
                    </button>
                  </div>
                ))}
                
                {remainingCount > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    +{remainingCount}
                  </span>
                )}
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2 ml-2">
            {selectedTypes.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAll();
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                aria-label="Clear all filters"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
            
            <svg
              className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search types..."
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Type Options */}
          <div className="max-h-48 overflow-y-auto">
            {filteredTypes.length === 0 ? (
              <div className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                No types found
              </div>
            ) : (
              <div className="p-2">
                {filteredTypes.map((type) => (
                  <button
                    key={type.name}
                    onClick={() => handleTypeToggle(type)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-md
                      hover:bg-gray-50 dark:hover:bg-gray-700
                      transition-colors duration-200
                      ${isTypeSelected(type) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                    `}
                  >
                    <TypeBadge type={type} size="sm" />
                    
                    {isTypeSelected(type) && (
                      <svg
                        className="w-4 h-4 text-blue-600 dark:text-blue-400"
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
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {selectedTypes.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedTypes.length} type{selectedTypes.length !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={handleClearAll}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};