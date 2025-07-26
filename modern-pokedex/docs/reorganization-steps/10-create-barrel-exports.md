# Step 10: Create Barrel Exports

## Overview
Create barrel export files (index.ts) to centralize exports and make imports cleaner throughout the application.

## Commands to Run

### 1. Create Components Barrel Export
```bash
cd modern-pokedex
touch src/components/index.ts
```

### 2. Create Utils Barrel Export
```bash
touch src/utils/index.ts
```

### 3. Create Hooks Barrel Export
```bash
touch src/hooks/index.ts
```

## File Contents

### src/components/index.ts
```typescript
// Layout Components
export { Header } from './layout/Header';
export { Footer } from './layout/Footer';
export { AppLayout } from './layout/AppLayout';

// UI Components
export { LoadingSpinner } from './ui/LoadingSpinner';
export { ErrorBoundary } from './ui/ErrorBoundary';
export { ErrorMessage } from './ui/ErrorMessage';
export { TypeBadge } from './ui/TypeBadge';
export { TypeBadgeGroup } from './ui/TypeBadgeGroup';
export { EmptyState } from './ui/EmptyState';
export { NoResults } from './ui/NoResults';
export { ThemeToggle } from './ui/ThemeToggle';
export { LanguageSelector } from './ui/LanguageSelector';
export { OptimizedImage } from './ui/OptimizedImage';
export { SearchError } from './ui/SearchError';

// Pokemon Components
export { PokemonCard } from './pokemon/PokemonCard';
export { PokemonCardSkeleton } from './pokemon/PokemonCardSkeleton';
export { PokemonDetail } from './pokemon/PokemonDetail';
export { PokemonStats } from './pokemon/PokemonStats';
export { PokemonGrid } from './pokemon/PokemonGrid';
export { PaginatedPokemonGrid } from './pokemon/PaginatedPokemonGrid';
export { VirtualizedPokemonGrid } from './pokemon/VirtualizedPokemonGrid';

// Filter Components
export { FilterPanel } from './filters/FilterPanel';
export { FilterBar } from './filters/FilterBar';
export { TypeFilter } from './filters/TypeFilter';

// Search Components
export { SearchBar } from './search/SearchBar';
export { SearchInput } from './search/SearchInput';

// Re-export types
export type { Pokemon } from '../types/pokemon';
export type { AppState, AppAction } from '../types/app';
```

### src/utils/index.ts
```typescript
// Type utilities
export { getTypeColor, getAllTypes } from './typeColors';

// Image utilities
export { 
  getPokemonImageUrl, 
  preloadPokemonImages, 
  getOptimizedImageUrl,
  handleImageError 
} from './imageUtils';

// Performance utilities
export {
  performanceMonitor,
  measureBundleSize,
  getMemoryUsage,
  measureWebVitals,
  preloadResource,
  prefetchResource,
  debounce,
  throttle,
  reportPerformanceMetrics
} from './performance';

// Pokemon transformation utilities
export {
  transformPokemonData,
  formatPokemonName,
  formatPokemonNumber,
  calculateStatPercentage,
  getTotalStats,
  processRawPokemonData,
  createPokemon
} from './pokemonTransform';

// Storage utilities
export {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearStorage,
  isStorageAvailable
} from './storage';

// Localization utilities
export {
  formatMessage,
  getLocalizedPokemonName,
  getLocalizedTypeName,
  getCurrentLanguage
} from './localization';
```

### src/hooks/index.ts
```typescript
// Performance hooks
export {
  usePerformanceMonitoring,
  useWebVitals,
  useMemoryMonitoring,
  useRenderTracking,
  useIntersectionObserver,
  useResourcePreloading
} from './usePerformance';

// Utility hooks
export { useDebounce } from './useDebounce';
export { useRouteSync } from './useRouteSync';

// Re-export common hook types
export type { DebounceOptions } from './useDebounce';
export type { RouteParams } from './useRouteSync';
```

## Benefits
- Cleaner imports: `import { PokemonCard, LoadingSpinner } from './components'`
- Centralized exports management
- Better code organization
- Easier refactoring

## Verification
```bash
# Test that barrel exports work
npm run build
npm run test:run
```

## Next Step
Continue to [Step 11: Create Documentation](11-create-documentation.md)