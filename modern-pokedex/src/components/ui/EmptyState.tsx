import React from 'react';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = ''
}) => {
  const { t } = useTranslation();

  const defaultIcon = (
    <svg
      className="w-16 h-16 text-gray-400 dark:text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.5a7.962 7.962 0 01-5-1.709m10-11.582A8.001 8.001 0 0012 3.5a8.001 8.001 0 00-5 1.709"
      />
    </svg>
  );

  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      <div className="mb-6">
        {icon || defaultIcon}
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {title || t('search.noResults')}
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {description || t('search.noResultsDescription')}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="
            inline-flex items-center px-4 py-2
            bg-blue-600 hover:bg-blue-700
            text-white font-medium rounded-lg
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          "
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

// Specialized empty states
export const NoResultsState: React.FC<{ onClearFilters?: () => void }> = ({ onClearFilters }) => {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16 text-gray-400 dark:text-gray-500"
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
      }
      title={t('search.noResults')}
      description={t('search.noResultsDescription')}
      action={onClearFilters ? {
        label: t('filters.clearAll'),
        onClick: onClearFilters
      } : undefined}
    />
  );
};

export const NoPokemonState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon={
        <div className="w-16 h-16 mx-auto mb-4">
          <div className="w-full h-full rounded-full bg-gradient-to-b from-red-500 to-red-600 relative overflow-hidden opacity-50">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500 rounded-t-full"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white rounded-b-full"></div>
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 transform -translate-y-0.5"></div>
            <div className="absolute top-1/2 left-1/2 w-1/3 h-1/3 bg-white rounded-full border-2 border-gray-800 transform -translate-x-1/2 -translate-y-1/2">
              <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-gray-200 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      }
      title="No Pokémon Found"
      description="We couldn't find any Pokémon. This might be a temporary issue."
      action={onRetry ? {
        label: t('error.tryAgain'),
        onClick: onRetry
      } : undefined}
    />
  );
};