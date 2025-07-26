import React from 'react';
import { useTranslation } from 'react-i18next';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  error?: string | Error;
  variant?: 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showRetryButton?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  variant = 'error',
  size = 'md',
  showIcon = true,
  onRetry,
  onDismiss,
  className = ''
}) => {
  const { t } = useTranslation();

  const variantClasses = {
    error: {
      container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      icon: 'text-red-500 dark:text-red-400',
      title: 'text-red-800 dark:text-red-200',
      message: 'text-red-700 dark:text-red-300',
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-500 dark:text-yellow-400',
      title: 'text-yellow-800 dark:text-yellow-200',
      message: 'text-yellow-700 dark:text-yellow-300',
      button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
    },
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      icon: 'text-blue-500 dark:text-blue-400',
      title: 'text-blue-800 dark:text-blue-200',
      message: 'text-blue-700 dark:text-blue-300',
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    }
  };

  const sizeClasses = {
    sm: {
      container: 'p-3',
      icon: 'w-4 h-4',
      title: 'text-sm',
      message: 'text-xs',
      button: 'px-2 py-1 text-xs'
    },
    md: {
      container: 'p-4',
      icon: 'w-5 h-5',
      title: 'text-base',
      message: 'text-sm',
      button: 'px-3 py-1.5 text-sm'
    },
    lg: {
      container: 'p-6',
      icon: 'w-6 h-6',
      title: 'text-lg',
      message: 'text-base',
      button: 'px-4 py-2 text-base'
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'error':
        return (
          <svg
            className={`${sizeClasses[size].icon} ${variantClasses[variant].icon}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg
            className={`${sizeClasses[size].icon} ${variantClasses[variant].icon}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case 'info':
        return (
          <svg
            className={`${sizeClasses[size].icon} ${variantClasses[variant].icon}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className={`
        border rounded-lg
        ${variantClasses[variant].container}
        ${sizeClasses[size].container}
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start">
        {showIcon && (
          <div className="flex-shrink-0 mr-3">
            {getIcon()}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`font-medium ${sizeClasses[size].title} ${variantClasses[variant].title} mb-1`}>
              {title}
            </h3>
          )}
          
          {message && (
            <p className={`${sizeClasses[size].message} ${variantClasses[variant].message}`}>
              {message}
            </p>
          )}
          
          {(onRetry || onDismiss) && (
            <div className="mt-3 flex space-x-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className={`
                    inline-flex items-center
                    ${sizeClasses[size].button}
                    ${variantClasses[variant].button}
                    text-white font-medium rounded
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                  `}
                >
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {t('error.tryAgain')}
                </button>
              )}
              
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className={`
                    inline-flex items-center
                    ${sizeClasses[size].button}
                    bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
                    text-gray-700 dark:text-gray-300 font-medium rounded
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                  `}
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
        
        {onDismiss && (
          <div className="flex-shrink-0 ml-3">
            <button
              onClick={onDismiss}
              className={`
                inline-flex rounded-md p-1.5
                ${variantClasses[variant].icon}
                hover:bg-black hover:bg-opacity-10
                focus:outline-none focus:ring-2 focus:ring-offset-2
              `}
            >
              <span className="sr-only">Dismiss</span>
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
          </div>
        )}
      </div>
    </div>
  );
};