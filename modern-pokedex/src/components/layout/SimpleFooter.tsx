import React from 'react';

export const SimpleFooter: React.FC = () => {
  return (
    <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-gray-200/20 dark:border-gray-700/20 transition-all duration-300">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-gray-900 dark:text-white font-semibold">Modern Pokédex</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2024 Modern Pokédex • Built with ❤️ using React & TypeScript
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
              Pokémon data from Kanto region dataset
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};