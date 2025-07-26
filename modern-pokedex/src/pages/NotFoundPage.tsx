import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoToPokemon = () => {
    navigate('/pokemon');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-gray-300 dark:text-gray-600 mb-4">
            404
          </div>
          <div className="w-32 h-32 mx-auto mb-6">
            <svg
              className="w-full h-full text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29.82-5.877 2.172M15 19.128A9.38 9.38 0 0112 21c-2.647 0-4.952-.896-6.824-2.388M12 3a9 9 0 019 9c0 1.93-.6 3.72-1.622 5.18M12 3a9 9 0 00-9 9c0 1.93.6 3.72 1.622 5.18"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleGoHome}
              className="
                inline-flex items-center justify-center px-6 py-3
                text-white bg-blue-600 hover:bg-blue-700
                dark:bg-blue-500 dark:hover:bg-blue-600
                rounded-lg font-medium
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go Home
            </button>

            <button
              onClick={handleGoToPokemon}
              className="
                inline-flex items-center justify-center px-6 py-3
                text-blue-600 bg-blue-50 hover:bg-blue-100
                dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/30
                border border-blue-200 dark:border-blue-800
                rounded-lg font-medium
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
            >
              <svg
                className="w-4 h-4 mr-2"
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
              Browse Pokémon
            </button>
          </div>

          <button
            onClick={handleGoBack}
            className="
              text-gray-500 hover:text-gray-700
              dark:text-gray-400 dark:hover:text-gray-200
              font-medium transition-colors duration-200
              focus:outline-none focus:underline
            "
          >
            ← Go Back
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you believe this is an error, please try refreshing the page or contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;