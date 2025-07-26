# API Documentation

## Overview

The Modern Pokédex application uses a service layer architecture to manage data operations. This document describes the API interfaces and data structures used throughout the application.

## Data Sources

### Pokemon Dataset
- **Source**: `pokemon_kanto_dataset.json`
- **Format**: JSON array of Pokemon objects
- **Location**: `src/assets/data/`
- **Size**: 151 Kanto region Pokemon

## Type Definitions

### Core Pokemon Types

```typescript
/**
 * Raw Pokemon data structure from the dataset
 */
interface PokemonRawData {
  id: number;
  name: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  abilities: Array<{
    name: string;
    isHidden: boolean;
  }>;
  moves: Array<{
    name: string;
    level: number;
  }>;
  height: number;
  weight: number;
  baseExperience: number;
}

/**
 * Processed Pokemon data for application use
 */
interface Pokemon extends PokemonRawData {
  displayName: string;
  typeColors: string[];
  totalStats: number;
  imageUrl: string;
}
```

### Search and Filter Types

```typescript
/**
 * Search parameters for Pokemon filtering
 */
interface SearchParams {
  query: string;
  types: string[];
  sortBy: 'id' | 'name' | 'stats';
  sortOrder: 'asc' | 'desc';
}

/**
 * Filter state for Pokemon list
 */
interface FilterState {
  searchQuery: string;
  selectedTypes: string[];
  showFavorites: boolean;
}
```

## Service Layer

### PokemonService

The main service class for Pokemon data operations.

```typescript
class PokemonService {
  /**
   * Load all Pokemon data from the dataset
   * @returns Promise<Pokemon[]> Array of processed Pokemon
   */
  static async loadPokemon(): Promise<Pokemon[]>

  /**
   * Get a single Pokemon by ID
   * @param id Pokemon ID
   * @returns Promise<Pokemon | null> Pokemon data or null if not found
   */
  static async getPokemonById(id: number): Promise<Pokemon | null>

  /**
   * Search Pokemon by name or ID
   * @param query Search query string
   * @param pokemon Array of Pokemon to search
   * @returns Pokemon[] Filtered Pokemon array
   */
  static searchPokemon(query: string, pokemon: Pokemon[]): Pokemon[]

  /**
   * Filter Pokemon by types
   * @param types Array of type names to filter by
   * @param pokemon Array of Pokemon to filter
   * @returns Pokemon[] Filtered Pokemon array
   */
  static filterByTypes(types: string[], pokemon: Pokemon[]): Pokemon[]

  /**
   * Sort Pokemon by specified criteria
   * @param pokemon Array of Pokemon to sort
   * @param sortBy Sort criteria
   * @param order Sort order
   * @returns Pokemon[] Sorted Pokemon array
   */
  static sortPokemon(
    pokemon: Pokemon[],
    sortBy: 'id' | 'name' | 'stats',
    order: 'asc' | 'desc'
  ): Pokemon[]
}
```

## Context APIs

### AppContext

Global application state management.

```typescript
interface AppState {
  pokemon: Pokemon[];
  filteredPokemon: Pokemon[];
  selectedPokemon: Pokemon | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedTypes: string[];
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  searchPokemon: (query: string) => void;
  filterByTypes: (types: string[]) => void;
  selectPokemon: (pokemon: Pokemon) => void;
  clearFilters: () => void;
}
```

### ThemeContext

Theme management for dark/light mode.

```typescript
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
}
```

### LanguageContext

Internationalization support.

```typescript
interface LanguageContextType {
  language: 'en' | 'th';
  setLanguage: (language: 'en' | 'th') => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}
```

## Utility Functions

### Type Colors

```typescript
/**
 * Get color for Pokemon type
 * @param type Pokemon type name
 * @returns string Tailwind CSS color class
 */
function getTypeColor(type: string): string

/**
 * Get all available Pokemon types
 * @returns string[] Array of type names
 */
function getAllTypes(): string[]
```

### Image Utils

```typescript
/**
 * Get Pokemon image URL
 * @param id Pokemon ID
 * @returns string Image URL
 */
function getPokemonImageUrl(id: number): string

/**
 * Preload Pokemon images
 * @param pokemon Array of Pokemon
 * @returns Promise<void>
 */
function preloadPokemonImages(pokemon: Pokemon[]): Promise<void>
```

### Performance Utils

```typescript
/**
 * Performance monitoring utilities
 */
interface PerformanceMonitor {
  startTiming: (name: string) => void;
  endTiming: (name: string) => PerformanceMetric | null;
  recordMetric: (name: string, data: any) => void;
  getMetrics: () => PerformanceMetric[];
  clearMetrics: () => void;
}
```

## Error Handling

### Error Types

```typescript
/**
 * Application error types
 */
type AppError = 
  | 'POKEMON_LOAD_ERROR'
  | 'POKEMON_NOT_FOUND'
  | 'SEARCH_ERROR'
  | 'FILTER_ERROR'
  | 'NETWORK_ERROR';

/**
 * Error object structure
 */
interface ErrorInfo {
  type: AppError;
  message: string;
  details?: any;
  timestamp: number;
}
```

### Error Boundaries

```typescript
/**
 * Error boundary component props
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
```

## Performance Considerations

### Data Loading
- Pokemon data is loaded once on app initialization
- Images are lazy-loaded as needed
- Search and filtering operations are debounced

### Caching
- Pokemon data is cached in memory
- Theme and language preferences are persisted to localStorage
- Image URLs are memoized

### Optimization
- Virtual scrolling for large Pokemon lists
- React.memo for expensive components
- Code splitting for route-based chunks

## Testing APIs

### Mock Data

```typescript
/**
 * Mock Pokemon data for testing
 */
const mockPokemon: Pokemon = {
  id: 25,
  name: 'pikachu',
  types: ['electric'],
  // ... other properties
};

/**
 * Mock service responses
 */
const mockPokemonService = {
  loadPokemon: jest.fn().mockResolvedValue([mockPokemon]),
  getPokemonById: jest.fn().mockResolvedValue(mockPokemon),
  // ... other methods
};
```

### Test Utilities

```typescript
/**
 * Render component with providers
 */
function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions
): RenderResult

/**
 * Mock API responses
 */
function mockApiResponse(data: any, delay?: number): Promise<any>
```

## Migration Guide

### From v1 to v2
- Pokemon data structure updated with new fields
- Service methods now return Promises
- Context APIs restructured for better performance

### Breaking Changes
- `getPokemon()` renamed to `loadPokemon()`
- Theme context now supports system preference
- Language context integrated with react-i18next

## Examples

### Basic Usage

```typescript
// Load Pokemon data
const pokemon = await PokemonService.loadPokemon();

// Search Pokemon
const results = PokemonService.searchPokemon('pika', pokemon);

// Filter by type
const electricPokemon = PokemonService.filterByTypes(['electric'], pokemon);
```

### Context Usage

```typescript
// Using AppContext
const { state, searchPokemon, filterByTypes } = useAppContext();

// Search for Pokemon
searchPokemon('charizard');

// Filter by multiple types
filterByTypes(['fire', 'flying']);
```

### Component Integration

```typescript
const PokemonList: React.FC = () => {
  const { state } = useAppContext();
  
  return (
    <div>
      {state.filteredPokemon.map(pokemon => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};
```