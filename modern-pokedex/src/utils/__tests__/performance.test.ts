import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  performanceMonitor,
  measureBundleSize,
  getMemoryUsage,
  measureWebVitals,
  preloadResource,
  prefetchResource,
  debounce,
  throttle,
  reportPerformanceMetrics
} from '../performance';

// Mock performance API
const mockPerformance = {
  now: vi.fn().mockReturnValue(1000),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn().mockReturnValue([]),
  getEntriesByName: vi.fn().mockReturnValue([]),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn(),
  memory: {
    usedJSHeapSize: 1000000,
    totalJSHeapSize: 2000000,
    jsHeapSizeLimit: 4000000,
  },
};

Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true,
});

// Mock PerformanceObserver
global.PerformanceObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn().mockReturnValue([]),
}));

// Mock document
const mockDocument = {
  createElement: vi.fn().mockReturnValue({
    rel: '',
    href: '',
    as: '',
    crossOrigin: '',
  }),
  head: {
    appendChild: vi.fn(),
  },
  addEventListener: vi.fn(),
  visibilityState: 'visible',
};

Object.defineProperty(global, 'document', {
  value: mockDocument,
  writable: true,
});

describe('performance utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPerformance.now.mockReturnValue(1000);
  });

  afterEach(() => {
    performanceMonitor.clearMetrics();
  });

  describe('PerformanceMonitor', () => {
    it('should start and end timing correctly', () => {
      performanceMonitor.startTiming('test-metric');
      mockPerformance.now.mockReturnValue(1500);
      const result = performanceMonitor.endTiming('test-metric');

      expect(result).toEqual({
        name: 'test-metric',
        startTime: 1000,
        endTime: 1500,
        duration: 500,
      });
    });

    it('should return null for non-existent metric', () => {
      const result = performanceMonitor.endTiming('non-existent');
      expect(result).toBeNull();
    });

    it('should record metric with metadata', () => {
      const metadata = { type: 'component', size: 100 };
      performanceMonitor.recordMetric('test-metric', {
        startTime: 1000,
        duration: 200,
        metadata,
      });

      const metric = performanceMonitor.getMetric('test-metric');
      expect(metric).toEqual({
        name: 'test-metric',
        startTime: 1000,
        duration: 200,
        metadata,
      });
    });

    it('should get all metrics', () => {
      performanceMonitor.recordMetric('metric1', { startTime: 1000 });
      performanceMonitor.recordMetric('metric2', { startTime: 1100 });

      const metrics = performanceMonitor.getMetrics();
      expect(metrics).toHaveLength(2);
      expect(metrics.map(m => m.name)).toEqual(['metric1', 'metric2']);
    });

    it('should clear all metrics', () => {
      performanceMonitor.recordMetric('metric1', { startTime: 1000 });
      performanceMonitor.clearMetrics();

      const metrics = performanceMonitor.getMetrics();
      expect(metrics).toHaveLength(0);
    });
  });

  describe('measureBundleSize', () => {
    it('should return empty array when no performance API', () => {
      const originalPerformance = global.performance;
      delete (global as any).performance;

      const result = measureBundleSize();
      expect(result).toEqual([]);

      global.performance = originalPerformance;
    });

    it('should measure bundle sizes correctly', () => {
      const mockResources = [
        {
          name: 'app.js',
          transferSize: 100000,
          encodedBodySize: 120000,
          responseEnd: 2000,
          requestStart: 1500,
        },
        {
          name: 'chunk-vendor.js',
          transferSize: 0, // cached
          encodedBodySize: 80000,
          responseEnd: 1800,
          requestStart: 1600,
        },
        {
          name: 'styles.css',
          transferSize: 20000,
          encodedBodySize: 25000,
          responseEnd: 1700,
          requestStart: 1650,
        },
      ];

      mockPerformance.getEntriesByType.mockReturnValue(mockResources);

      const result = measureBundleSize();
      expect(result).toHaveLength(2); // Only JS files
      expect(result[0]).toEqual({
        name: 'app.js',
        size: 100000,
        loadTime: 500,
        cached: false,
      });
      expect(result[1]).toEqual({
        name: 'chunk-vendor.js',
        size: 80000,
        loadTime: 200,
        cached: true,
      });
    });
  });

  describe('getMemoryUsage', () => {
    it('should return memory usage when available', () => {
      const result = getMemoryUsage();
      expect(result).toEqual({
        used: 1000000,
        total: 2000000,
        limit: 4000000,
        percentage: 25,
      });
    });

    it('should return null when memory API not available', () => {
      const originalMemory = mockPerformance.memory;
      delete mockPerformance.memory;

      const result = getMemoryUsage();
      expect(result).toBeNull();

      mockPerformance.memory = originalMemory;
    });
  });

  describe('measureWebVitals', () => {
    it('should set up performance observers', () => {
      const callback = vi.fn();
      measureWebVitals(callback);

      expect(PerformanceObserver).toHaveBeenCalledTimes(2); // CLS and FID
    });

    it('should handle observer creation errors', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Mock PerformanceObserver to throw
      global.PerformanceObserver = vi.fn().mockImplementation(() => {
        throw new Error('Not supported');
      });

      const callback = vi.fn();
      measureWebVitals(callback);

      expect(consoleSpy).toHaveBeenCalledWith('CLS measurement not supported:', expect.any(Error));
      expect(consoleSpy).toHaveBeenCalledWith('FID measurement not supported:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('resource loading', () => {
    it('should preload resource correctly', () => {
      const mockLink = {
        rel: '',
        href: '',
        as: '',
        crossOrigin: '',
      };
      mockDocument.createElement.mockReturnValue(mockLink);

      preloadResource('/app.js', 'script', 'anonymous');

      expect(mockDocument.createElement).toHaveBeenCalledWith('link');
      expect(mockLink.rel).toBe('preload');
      expect(mockLink.href).toBe('/app.js');
      expect(mockLink.as).toBe('script');
      expect(mockLink.crossOrigin).toBe('anonymous');
      expect(mockDocument.head.appendChild).toHaveBeenCalledWith(mockLink);
    });

    it('should prefetch resource correctly', () => {
      const mockLink = {
        rel: '',
        href: '',
      };
      mockDocument.createElement.mockReturnValue(mockLink);

      prefetchResource('/next-page.js');

      expect(mockDocument.createElement).toHaveBeenCalledWith('link');
      expect(mockLink.rel).toBe('prefetch');
      expect(mockLink.href).toBe('/next-page.js');
      expect(mockDocument.head.appendChild).toHaveBeenCalledWith(mockLink);
    });

    it('should handle document not available', () => {
      const originalDocument = global.document;
      delete (global as any).document;

      expect(() => preloadResource('/app.js', 'script')).not.toThrow();
      expect(() => prefetchResource('/app.js')).not.toThrow();

      global.document = originalDocument;
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn('arg1');
      debouncedFn('arg2');
      debouncedFn('arg3');

      expect(fn).not.toHaveBeenCalled();

      await new Promise(resolve => setTimeout(resolve, 150));

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('arg3');
    });

    it('should call immediately when immediate is true', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100, true);

      debouncedFn('arg1');

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('arg1');
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);

      throttledFn('arg1');
      throttledFn('arg2');
      throttledFn('arg3');

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('arg1');

      await new Promise(resolve => setTimeout(resolve, 150));

      throttledFn('arg4');
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenCalledWith('arg4');
    });
  });

  describe('reportPerformanceMetrics', () => {
    it('should generate performance report', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // Mock window
      Object.defineProperty(global, 'window', {
        value: {
          location: { href: 'http://localhost:3000' },
          navigator: { userAgent: 'test-agent' },
        },
        writable: true,
      });

      performanceMonitor.recordMetric('test-metric', { startTime: 1000, duration: 100 });

      const report = reportPerformanceMetrics();

      expect(report).toEqual({
        timestamp: expect.any(Number),
        url: 'http://localhost:3000',
        userAgent: 'test-agent',
        metrics: expect.any(Array),
        memory: expect.any(Object),
        bundles: expect.any(Array),
        vitals: {},
      });

      expect(consoleSpy).toHaveBeenCalledWith('Performance Report:', report);

      consoleSpy.mockRestore();
    });
  });
});