import { useEffect, useCallback, useRef } from 'react';
import { performanceMonitor, measureWebVitals, getMemoryUsage } from '../utils/performance';

export const usePerformanceMonitoring = (componentName: string) => {
  const mountTimeRef = useRef<string>(`${componentName}-mount`);

  useEffect(() => {
    // Start timing component mount
    performanceMonitor.startTiming(mountTimeRef.current);

    return () => {
      // End timing on unmount
      performanceMonitor.endTiming(mountTimeRef.current);
    };
  }, []);

  const startTiming = useCallback((name: string) => {
    performanceMonitor.startTiming(`${componentName}-${name}`);
  }, [componentName]);

  const endTiming = useCallback((name: string) => {
    return performanceMonitor.endTiming(`${componentName}-${name}`);
  }, [componentName]);

  return { startTiming, endTiming };
};

export const useWebVitals = (onMetric?: (metric: any) => void) => {
  useEffect(() => {
    measureWebVitals((metric) => {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Web Vital - ${metric.name}:`, metric.value);
      }
      
      // Call custom handler
      onMetric?.(metric);
      
      // Record in performance monitor
      performanceMonitor.recordMetric(`web-vital-${metric.name.toLowerCase()}`, {
        startTime: performance.now(),
        duration: metric.value,
        metadata: { entries: metric.entries }
      });
    });
  }, [onMetric]);
};

export const useMemoryMonitoring = (interval: number = 30000) => {
  useEffect(() => {
    const monitorMemory = () => {
      const memoryUsage = getMemoryUsage();
      if (memoryUsage) {
        performanceMonitor.recordMetric('memory-usage', {
          startTime: performance.now(),
          metadata: memoryUsage
        });

        // Warn if memory usage is high
        if (memoryUsage.percentage > 80) {
          console.warn('High memory usage detected:', memoryUsage);
        }
      }
    };

    // Initial measurement
    monitorMemory();

    // Set up interval
    const intervalId = setInterval(monitorMemory, interval);

    return () => clearInterval(intervalId);
  }, [interval]);
};

export const useRenderTracking = (componentName: string) => {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(performance.now());

  useEffect(() => {
    renderCountRef.current += 1;
    const currentTime = performance.now();
    const timeSinceLastRender = currentTime - lastRenderTimeRef.current;
    lastRenderTimeRef.current = currentTime;

    performanceMonitor.recordMetric(`${componentName}-render`, {
      startTime: currentTime,
      metadata: {
        renderCount: renderCountRef.current,
        timeSinceLastRender
      }
    });

    // Warn about frequent re-renders
    if (timeSinceLastRender < 16 && renderCountRef.current > 10) {
      console.warn(`Frequent re-renders detected in ${componentName}:`, {
        renderCount: renderCountRef.current,
        timeSinceLastRender
      });
    }
  });

  return {
    renderCount: renderCountRef.current,
    resetRenderCount: () => {
      renderCountRef.current = 0;
    }
  };
};

export const useIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observe = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.observe(element);
    }
  }, []);

  const unobserve = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element);
    }
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(callback, {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options]);

  return { observe, unobserve };
};

export const useResourcePreloading = () => {
  const preloadResource = useCallback((href: string, as: string, crossorigin?: string) => {
    if (typeof document === 'undefined') return;

    // Check if already preloaded
    const existing = document.querySelector(`link[rel="preload"][href="${href}"]`);
    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (crossorigin) link.crossOrigin = crossorigin;
    
    document.head.appendChild(link);
  }, []);

  const prefetchResource = useCallback((href: string) => {
    if (typeof document === 'undefined') return;

    // Check if already prefetched
    const existing = document.querySelector(`link[rel="prefetch"][href="${href}"]`);
    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    
    document.head.appendChild(link);
  }, []);

  return { preloadResource, prefetchResource };
};