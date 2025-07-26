import React from 'react';
import { useTranslation } from 'react-i18next';

interface SearchErrorProps {
  error: Error | string;
  onRetry?: () => void;
  onClearFilters?: () => void;
  className?: string;
  showRetryButton?: boolean;
  showClearFiltersButton?: boolean;
}

export const SearchError: React.FC<SearchErrorProps> = ({
  error,
  onRetry,
  onClearFilters,
  className = '',
  showRetryButton = true,
  showClearFiltersButton = false
}) => {
  const { t } = useTranslation();

  const errorMessage = typeof error === 'string' ? error : error.message;
  
  const getErrorTitle = () => {
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return t('searchError.networkTitle');
    } else if (errorMessage.includes('timeout')) {
      return t('searchError.timeoutTitle');
    } else {
      return t('searchError.generalTitle');
    }
  };

  const getErrorDescription = () => {
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return t('searchError.networkDescription');
    } else if (errorMessage.includes('timeout')) {
      return t('searchError.timeoutDescription');
    } else {
      return t('searchError.generalDescription');
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {/* Error Icon */}
      <div className="mb-6">
        <svg
          className="w-16 h-16 text-red-300 dark:text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {getErrorTitle()}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        {getErrorDescription()}
      </p>

      {/* Error Details (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mb-6 max-w-md">
          <summary className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">
            {t('searchError.showDetails')}
          </summary>
          <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-xs text-left overflow-auto">
            {errorMessage}
          </pre>
        </details>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {showRetryButton && onRetry && (
          <button
            onClick={onRetry}
            className="
              px-6 py-2 text-sm font-medium
              text-white
              bg-blue-600 hover:bg-blue-700
              dark:bg-blue-500 dark:hover:bg-blue-600
              rounded-lg
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            "
          >
            {t('searchError.retry')}
          </button>
        )}
        
        {showClearFiltersButton && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="
              px-6 py-2 text-sm font-medium
              text-gray-600 dark:text-gray-400
              hover:text-gray-700 dark:hover:text-gray-300
              border border-gray-300 dark:border-gray-600
              rounded-lg
              hover:bg-gray-50 dark:hover:bg-gray-700
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
            "
          >
            {t('searchError.clearFilters')}
          </button>
        )}
      </div>

      {/* Help Text */}
      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 max-w-md">
        {t('searchError.helpText')}
      </p>
    </div>
  );
};