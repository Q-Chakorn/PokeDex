/**
 * Performance optimization utilities
 */

// Performance monitoring
export interface PerformanceMetrics {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Observe navigation timing
      try {
        const navObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              this.recordNavigationMetrics(entry as PerformanceNavigationTiming);
            }
          }
        });
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navObserver);
      } catch (error) {
        console.warn('Navigation timing observer not supported:', error);
      }

      // Observe paint timing
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'paint') {
              this.recordPaintMetrics(entry);
            }
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);
      } catch (error) {
        console.warn('Paint timing observer not supported:', error);
      }

      // Observe largest contentful paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.recordMetric('largest-contentful-paint', {
            startTime: lastEntry.startTime,
            duration: lastEntry.startTime,
            metadata: { size: (lastEntry as any).size }
          });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        console.warn('LCP observer not supported:', error);
      }
    }
  }

  private recordNavigationMetrics(entry: PerformanceNavigationTiming) {
    const metrics = {
      'dns-lookup': entry.domainLookupEnd - entry.domainLookupStart,
      'tcp-connection': entry.connectEnd - entry.connectStart,
      'tls-negotiation': entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0,
      'request-response': entry.responseEnd - entry.requestStart,
      'dom-processing': entry.domComplete - entry.domLoading,
      'page-load': entry.loadEventEnd - entry.navigationStart,
    };

    Object.entries(metrics).forEach(([name, duration]) => {
      this.recordMetric(`navigation-${name}`, {
        startTime: performance.now(),
        duration,
        metadata: { type: 'navigation' }
      });
    });
  }

  private recordPaintMetrics(entry: PerformanceEntry) {
    this.recordMetric(entry.name, {
      startTime: entry.startTime,
      duration: entry.startTime,
      metadata: { type: 'paint' }
    });
  }

  startTiming(name: string, metadata?: Record<string, any>): void {
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      metadata
    });
  }

  endTiming(name: string): PerformanceMetrics | null {
    const metric = this.metrics.get(name);
    if (!metric) return null;

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    const completedMetric: PerformanceMetrics = {
      ...metric,
      endTime,
      duration
    };

    this.metrics.set(name, completedMetric);
    return completedMetric;
  }

  recordMetric(name: string, data: Partial<PerformanceMetrics>): void {
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      ...data
    });
  }

  getMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  getMetric(name: string): PerformanceMetrics | undefined {
    return this.metrics.get(name);
  }

  clearMetrics(): void {
    this.metrics.clear();
  }

  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.clearMetrics();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// React performance utilities
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  const React = require('react');
  return React.memo((props: P) => {
    React.useEffect(() => {
      performanceMonitor.startTiming(`component-${componentName}-mount`);
      return () => {
        performanceMonitor.endTiming(`component-${componentName}-mount`);
      };
    }, []);

    return React.createElement(Component, props);
  });
};

// Bundle analysis utilities
export const measureBundleSize = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const jsResources = resources.filter(resource => 
      resource.name.endsWith('.js') || resource.name.includes('chunk')
    );

    const bundleMetrics = jsResources.map(resource => ({
      name: resource.name.split('/').pop() || resource.name,
      size: resource.transferSize || resource.encodedBodySize,
      loadTime: resource.responseEnd - resource.requestStart,
      cached: resource.transferSize === 0
    }));

    return bundleMetrics;
  }
  return [];
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
      percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    };
  }
  return null;
};

// Web Vitals measurement
export const measureWebVitals = (callback: (metric: any) => void) => {
  if (typeof window === 'undefined') return;

  // Cumulative Layout Shift
  let clsValue = 0;
  let clsEntries: PerformanceEntry[] = [];

  try {
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          clsEntries.push(entry);
        }
      }
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Report CLS when page becomes hidden
    const reportCLS = () => {
      callback({
        name: 'CLS',
        value: clsValue,
        entries: clsEntries
      });
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportCLS();
      }
    });
  } catch (error) {
    console.warn('CLS measurement not supported:', error);
  }

  // First Input Delay
  try {
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        callback({
          name: 'FID',
          value: (entry as any).processingStart - entry.startTime,
          entries: [entry]
        });
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (error) {
    console.warn('FID measurement not supported:', error);
  }
};

// Resource loading optimization
export const preloadResource = (href: string, as: string, crossorigin?: string) => {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (crossorigin) link.crossOrigin = crossorigin;
  
  document.head.appendChild(link);
};

export const prefetchResource = (href: string) => {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  
  document.head.appendChild(link);
};

// Code splitting utilities
export const loadChunk = async (chunkName: string) => {
  performanceMonitor.startTiming(`chunk-load-${chunkName}`);
  
  try {
    const module = await import(/* webpackChunkName: "[request]" */ `../components/${chunkName}`);
    performanceMonitor.endTiming(`chunk-load-${chunkName}`);
    return module;
  } catch (error) {
    performanceMonitor.endTiming(`chunk-load-${chunkName}`);
    throw error;
  }
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Debounce and throttle utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Performance reporting
export const reportPerformanceMetrics = () => {
  const metrics = performanceMonitor.getMetrics();
  const memoryUsage = getMemoryUsage();
  const bundleMetrics = measureBundleSize();

  const report = {
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    metrics,
    memory: memoryUsage,
    bundles: bundleMetrics,
    vitals: {
      // These would be populated by measureWebVitals callback
    }
  };

  // In a real application, send this to your analytics service
  console.log('Performance Report:', report);
  
  return report;
};

// React Suspense utilities
export const createSuspenseResource = <T>(promise: Promise<T>) => {
  let status = 'pending';
  let result: T;
  let error: any;

  const suspender = promise.then(
    (res) => {
      status = 'success';
      result = res;
    },
    (err) => {
      status = 'error';
      error = err;
    }
  );

  return {
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw error;
      } else if (status === 'success') {
        return result;
      }
    }
  };
};