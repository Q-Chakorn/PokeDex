import React, { useState, useRef, useEffect } from 'react';

interface SearchSuggestion {
  text: string;
  type: 'pokemon' | 'type' | 'category';
  icon?: string;
}

interface EnhancedSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  resultsCount?: number;
  className?: string;
  showResultsIndicator?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  suggestions = [],
  resultsCount,
  className = '',
  showResultsIndicator = false,
  size = 'md'
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const clearSearch = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={`apple-search-container ${className}`}>
      {/* Apple-style Search Input */}
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-4 sm:left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg 
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
              isFocused || value 
                ? 'text-gray-600' 
                : 'text-gray-400'
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={1.8}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="apple-search-input"
          style={{
            fontSize: '16px', // Prevents zoom on iOS
          }}
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={clearSearch}
            className="absolute right-4 sm:right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Minimal Results Count (Apple style) */}
      {showResultsIndicator && value && resultsCount !== undefined && (
        <div className="mt-2 sm:mt-3 text-center px-2">
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            {resultsCount === 0 ? 'No results found' : `${resultsCount} result${resultsCount === 1 ? '' : 's'} found`}
          </span>
        </div>
      )}
    </div>
  );
};