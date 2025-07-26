import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSearchIcon?: boolean;
  showClearButton?: boolean;
  autoFocus?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value = '',
  onChange,
  onSearch,
  placeholder,
  debounceMs = 300,
  disabled = false,
  className = '',
  size = 'md',
  showSearchIcon = true,
  showClearButton = true,
  autoFocus = false
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: {
      container: 'h-8',
      input: 'text-sm px-8 py-1',
      icon: 'w-4 h-4',
      iconLeft: 'left-2',
      iconRight: 'right-2'
    },
    md: {
      container: 'h-10',
      input: 'text-base px-10 py-2',
      icon: 'w-5 h-5',
      iconLeft: 'left-3',
      iconRight: 'right-3'
    },
    lg: {
      container: 'h-12',
      input: 'text-lg px-12 py-3',
      icon: 'w-6 h-6',
      iconLeft: 'left-3',
      iconRight: 'right-3'
    }
  };

  // Update internal state when external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (onSearch && inputValue !== value) {
        onSearch(inputValue);
      }
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue, onSearch, debounceMs, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleClear = () => {
    setInputValue('');
    if (onChange) {
      onChange('');
    }
    if (onSearch) {
      onSearch('');
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onSearch) {
        onSearch(inputValue);
      }
    }
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  const defaultPlaceholder = placeholder || t('search.placeholder');

  return (
    <div className={`relative ${sizeClasses[size].container} ${className}`}>
      {/* Search Icon */}
      {showSearchIcon && (
        <div className={`absolute ${sizeClasses[size].iconLeft} top-1/2 transform -translate-y-1/2 pointer-events-none`}>
          <svg
            className={`${sizeClasses[size].icon} text-gray-400 dark:text-gray-500`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      )}

      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={defaultPlaceholder}
        disabled={disabled}
        className={`
          w-full ${sizeClasses[size].input} ${sizeClasses[size].container}
          bg-white dark:bg-gray-800
          border border-gray-300 dark:border-gray-600
          rounded-lg
          text-gray-900 dark:text-white
          placeholder-gray-500 dark:placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          ${isFocused ? 'ring-2 ring-blue-500 border-transparent' : ''}
          ${showSearchIcon ? '' : 'pl-3'}
          ${showClearButton && inputValue ? 'pr-10' : showClearButton ? 'pr-10' : 'pr-3'}
        `}
        aria-label={defaultPlaceholder}
      />

      {/* Clear Button */}
      {showClearButton && inputValue && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className={`
            absolute ${sizeClasses[size].iconRight} top-1/2 transform -translate-y-1/2
            p-1 rounded-full
            text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          `}
          aria-label={t('search.clear')}
          title={t('search.clear')}
        >
          <svg
            className={sizeClasses[size].icon}
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

      {/* Loading Indicator (when searching) */}
      {/* This can be added later when integrating with actual search */}
    </div>
  );
};