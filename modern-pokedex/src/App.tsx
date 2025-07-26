import React from 'react';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { SimpleThemeProvider } from './contexts/SimpleThemeContext';
import { SimpleLanguageProvider } from './contexts/SimpleLanguageContext';
import { PokemonProvider } from './contexts/SimplePokemonContext';
import { AppRouter } from './router/AppRouter';
import './i18n';

/**
 * Main Application Component
 * 
 * This is the root component that sets up all the necessary providers
 * and routing for the Modern Pokédex application.
 * 
 * Provider hierarchy (outer to inner):
 * 1. ErrorBoundary - Catches and handles React errors gracefully
 * 2. ThemeProvider - Manages dark/light theme state and persistence
 * 3. LanguageProvider - Handles internationalization (EN/TH) with i18next
 * 4. AppProvider - Manages global application state (Pokemon data, search, filters)
 * 5. AppRouter - Handles client-side routing between pages
 * 
 * The i18n configuration is imported to initialize internationalization
 * before the component renders.
 * 
 * @returns {JSX.Element} The complete application with all providers and routing
 */
const App: React.FC = (): JSX.Element => {
  return (
    <ErrorBoundary>
      <SimpleThemeProvider>
        <SimpleLanguageProvider>
          <PokemonProvider>
            <AppRouter />
          </PokemonProvider>
        </SimpleLanguageProvider>
      </SimpleThemeProvider>
    </ErrorBoundary>
  );
};

export default App;