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