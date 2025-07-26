import React from 'react';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left side - Copyright */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>
              © {currentYear} {t('app.title')}. All rights reserved.
            </p>
          </div>

          {/* Center - Links */}
          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Contact
            </a>
          </div>

          {/* Right side - Attribution */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>
              Powered by{' '}
              <a
                href="https://pokeapi.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                PokéAPI
              </a>
            </p>
          </div>
        </div>

        {/* Bottom section - Additional info */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Pokémon and Pokémon character names are trademarks of Nintendo. 
              This is a fan-made project and is not affiliated with Nintendo, Game Freak, or Creatures Inc.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};