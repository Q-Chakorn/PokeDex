import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchInput } from './SearchInput';
import type { Pokemon } from '../../types/pokemon';

interface SearchSuggestion {
  id: number;
  name: string;
  dexNumber: string;
  types: string[];
}

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onSuggestionSelect?: (pokemon: Pokemon) => void;
  suggestions?: SearchSuggestion[];
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSuggestions?: boolean;
  maxSuggestions?: number;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  onSearch,
  onSuggestionSelect,
  suggestions = [],
  loading = false,
  disabled = false,
  className = '',
  size = 'md',
  showSuggestions = true,
  maxSuggestions = 5,
  debounceMs = 300
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const displayedSuggestions = suggestions.slice(0, maxSuggestions);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show suggestions when there's a value and suggestions exist
  useEffect(() => {
    if (showSuggestions && value.trim() && displayedSuggestions.length > 0) {
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [value, displayedSuggestions.length, showSuggestions]);

  const handleInputChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSearch = (searchValue: string) => {
    setIsOpen(false);
    setSelectedIndex(-1);
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setIsOpen(false);
    setSelectedIndex(-1);
    
    if (onChange) {
      onChange(suggestion.name);
    }
    
    if (onSuggestionSelect) {
      // Convert suggestion to Pokemon (simplified)
      const pokemon = {
        id: suggestion.id,
        name: suggestion.name,
        dexNumber: suggestion.dexNumber,
        types: suggestion.types.map(type => ({ name: type, color: '#68A090' }))
      } as Pokemon;
      onSuggestionSelect(pokemon);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || displayedSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < displayedSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : displayedSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < displayedSuggestions.length) {
          handleSuggestionClick(displayedSuggestions[selectedIndex]);
        } else {
          handleSearch(value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>
      <SearchInput
        value={value}
        onChange={handleInputChange}
        onSearch={handleSearch}
        disabled={disabled}
        size={size}
        debounceMs={debounceMs}
        className="w-full"
      />

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {isOpen && showSuggestions && displayedSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="
            absolute top-full left-0 right-0 mt-1 z-50
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            rounded-lg shadow-lg
            max-h-60 overflow-y-auto
          "
          role="listbox"
          aria-label="Search suggestions"
        >
          {displayedSuggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              type="button"
              className={`
                w-full px-4 py-3 text-left
                hover:bg-gray-50 dark:hover:bg-gray-700
                focus:bg-gray-50 dark:focus:bg-gray-700
                focus:outline-none
                transition-colors duration-150
                ${index === selectedIndex ? 'bg-gray-50 dark:bg-gray-700' : ''}
                ${index === 0 ? 'rounded-t-lg' : ''}
                ${index === displayedSuggestions.length - 1 ? 'rounded-b-lg' : ''}
              `}
              onClick={() => handleSuggestionClick(suggestion)}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                    {suggestion.dexNumber}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {suggestion.name}
                  </span>
                </div>
                <div className="flex space-x-1">
                  {suggestion.types.slice(0, 2).map((type, typeIndex) => (
                    <span
                      key={typeIndex}
                      className="
                        px-2 py-1 text-xs font-medium rounded-full
                        bg-gray-100 dark:bg-gray-600
                        text-gray-700 dark:text-gray-300
                      "
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {isOpen && showSuggestions && value.trim() && displayedSuggestions.length === 0 && !loading && (
        <div className="
          absolute top-full left-0 right-0 mt-1 z-50
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-lg shadow-lg
          px-4 py-3
        ">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {t('search.noResults')}
          </p>
        </div>
      )}
    </div>
  );
};