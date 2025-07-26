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