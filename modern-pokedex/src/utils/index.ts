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