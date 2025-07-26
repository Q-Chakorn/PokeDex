import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  usePerformanceMonitoring,
  useWebVitals,
  useMemoryMonitoring,
  useRenderTracking,
  useIntersectionObserver,
  useResourcePreloading
} from '../usePerformance';

// Mock performance utilities
vi.mock('../../utils/performance', () => ({
  performanceMonitor: {
    startTiming: vi.fn(),
    endTiming: vi.fn(),
    recordMetric: vi.fn(),
  },
  measureWebVitals: vi.fn(),
  getMemoryUsage: vi.fn().mockReturnValue({
    used: 1000000,
    total: 2000000,
    limit: 4000000,
    percentage: 25,
  }),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
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
  querySelector: vi.fn(),
};

Object.defineProperty(global, 'document', {
  value: mockDocument,
  writable: true,
});

describe('usePerformance hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('usePerformanceMonitoring', () => {
    it('should start timing on mount and end on unmount', () => {
      const { performanceMonitor } = require('../../utils/performance');
      const { unmount } = renderHook(() => usePerformanceMonitoring('TestComponent'));

      expect(performanceMonitor.startTiming).toHaveBeenCalledWith('TestComponent-mount');

      unmount();

      expect(performanceMonitor.endTiming).toHaveBeenCalledWith('TestComponent-mount');
    });

    it('should provide timing functions', () => {
      const { performanceMonitor } = require('../../utils/performance');
      const { result } = renderHook(() => usePerformanceMonitoring('TestComponent'));

      act(() => {
        result.current.startTiming('custom-operation');
      });

      expect(performanceMonitor.startTiming).toHaveBeenCalledWith('TestComponent-custom-operation');

      act(() => {
        result.current.endTiming('custom-operation');
      });

      expect(performanceMonitor.endTiming).toHaveBeenCalledWith('TestComponent-custom-operation');
    });
  });

  describe('useWebVitals', () => {
    it('should set up web vitals measurement', () => {
      const { measureWebVitals } = require('../../utils/performance');
      const onMetric = vi.fn();

      renderHook(() => useWebVitals(onMetric));

      expect(measureWebVitals).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should handle metric callback', () => {
      const { measureWebVitals, performanceMonitor } = require('../../utils/performance');
      const onMetric = vi.fn();

      renderHook(() => useWebVitals(onMetric));

      // Simulate metric callback
      const metricCallback = measureWebVitals.mock.calls[0][0];
      const mockMetric = {
        name: 'CLS',
        value: 0.1,
        entries: [],
      };

      act(() => {
        metricCallback(mockMetric);
      });

      expect(onMetric).toHaveBeenCalledWith(mockMetric);
      expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
        'web-vital-cls',
        expect.objectContaining({
          duration: 0.1,
          metadata: { entries: [] },
        })
      );
    });

    it('should work without onMetric callback', () => {
      const { measureWebVitals } = require('../../utils/performance');

      expect(() => {
        renderHook(() => useWebVitals());
      }).not.toThrow();

      expect(measureWebVitals).toHaveBeenCalled();
    });
  });

  describe('useMemoryMonitoring', () => {
    it('should monitor memory usage at intervals', async () => {
      const { getMemoryUsage, performanceMonitor } = require('../../utils/performance');

      renderHook(() => useMemoryMonitoring(100)); // 100ms interval

      // Wait for initial measurement
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(getMemoryUsage).toHaveBeenCalled();
      expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
        'memory-usage',
        expect.objectContaining({
          metadata: expect.objectContaining({
            used: 1000000,
            total: 2000000,
            limit: 4000000,
            percentage: 25,
          }),
        })
      );
    });

    it('should warn on high memory usage', async () => {
      const { getMemoryUsage } = require('../../utils/performance');
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      getMemoryUsage.mockReturnValue({
        used: 3500000,
        total: 4000000,
        limit: 4000000,
        percentage: 87.5, // > 80%
      });

      renderHook(() => useMemoryMonitoring(100));

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(consoleSpy).toHaveBeenCalledWith(
        'High memory usage detected:',
        expect.objectContaining({ percentage: 87.5 })
      );

      consoleSpy.mockRestore();
    });

    it('should cleanup interval on unmount', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      const { unmount } = renderHook(() => useMemoryMonitoring(100));

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });

  describe('useRenderTracking', () => {
    it('should track render count and timing', () => {
      const { performanceMonitor } = require('../../utils/performance');
      const { result, rerender } = renderHook(() => useRenderTracking('TestComponent'));

      expect(result.current.renderCount).toBe(1);
      expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
        'TestComponent-render',
        expect.objectContaining({
          metadata: expect.objectContaining({
            renderCount: 1,
          }),
        })
      );

      rerender();
      expect(result.current.renderCount).toBe(2);
    });

    it('should warn about frequent re-renders', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { rerender } = renderHook(() => useRenderTracking('TestComponent'));

      // Simulate frequent re-renders
      for (let i = 0; i < 15; i++) {
        rerender();
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        'Frequent re-renders detected in TestComponent:',
        expect.objectContaining({
          renderCount: expect.any(Number),
        })
      );

      consoleSpy.mockRestore();
    });

    it('should reset render count', () => {
      const { result, rerender } = renderHook(() => useRenderTracking('TestComponent'));

      rerender();
      rerender();
      expect(result.current.renderCount).toBe(3);

      act(() => {
        result.current.resetRenderCount();
      });

      expect(result.current.renderCount).toBe(0);
    });
  });

  describe('useIntersectionObserver', () => {
    it('should create intersection observer', () => {
      const callback = vi.fn();
      const options = { threshold: 0.5 };

      renderHook(() => useIntersectionObserver(callback, options));

      expect(IntersectionObserver).toHaveBeenCalledWith(
        callback,
        expect.objectContaining({
          root: null,
          rootMargin: '50px',
          threshold: 0.5,
        })
      );
    });

    it('should provide observe and unobserve functions', () => {
      const callback = vi.fn();
      const mockElement = document.createElement('div');
      const { result } = renderHook(() => useIntersectionObserver(callback));

      const mockObserver = {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };

      (IntersectionObserver as any).mockImplementation(() => mockObserver);

      act(() => {
        result.current.observe(mockElement);
      });

      expect(mockObserver.observe).toHaveBeenCalledWith(mockElement);

      act(() => {
        result.current.unobserve(mockElement);
      });

      expect(mockObserver.unobserve).toHaveBeenCalledWith(mockElement);
    });

    it('should disconnect observer on unmount', () => {
      const callback = vi.fn();
      const mockObserver = {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };

      (IntersectionObserver as any).mockImplementation(() => mockObserver);

      const { unmount } = renderHook(() => useIntersectionObserver(callback));

      unmount();

      expect(mockObserver.disconnect).toHaveBeenCalled();
    });
  });

  describe('useResourcePreloading', () => {
    it('should provide preload and prefetch functions', () => {
      const { result } = renderHook(() => useResourcePreloading());

      expect(typeof result.current.preloadResource).toBe('function');
      expect(typeof result.current.prefetchResource).toBe('function');
    });

    it('should preload resource correctly', () => {
      const mockLink = {
        rel: '',
        href: '',
        as: '',
        crossOrigin: '',
      };
      mockDocument.createElement.mockReturnValue(mockLink);
      mockDocument.querySelector.mockReturnValue(null); // Not already preloaded

      const { result } = renderHook(() => useResourcePreloading());

      act(() => {
        result.current.preloadResource('/app.js', 'script', 'anonymous');
      });

      expect(mockDocument.createElement).toHaveBeenCalledWith('link');
      expect(mockLink.rel).toBe('preload');
      expect(mockLink.href).toBe('/app.js');
      expect(mockLink.as).toBe('script');
      expect(mockLink.crossOrigin).toBe('anonymous');
      expect(mockDocument.head.appendChild).toHaveBeenCalledWith(mockLink);
    });

    it('should not preload if already exists', () => {
      mockDocument.querySelector.mockReturnValue({}); // Already exists

      const { result } = renderHook(() => useResourcePreloading());

      act(() => {
        result.current.preloadResource('/app.js', 'script');
      });

      expect(mockDocument.head.appendChild).not.toHaveBeenCalled();
    });

    it('should prefetch resource correctly', () => {
      const mockLink = {
        rel: '',
        href: '',
      };
      mockDocument.createElement.mockReturnValue(mockLink);
      mockDocument.querySelector.mockReturnValue(null); // Not already prefetched

      const { result } = renderHook(() => useResourcePreloading());

      act(() => {
        result.current.prefetchResource('/next-page.js');
      });

      expect(mockDocument.createElement).toHaveBeenCalledWith('link');
      expect(mockLink.rel).toBe('prefetch');
      expect(mockLink.href).toBe('/next-page.js');
      expect(mockDocument.head.appendChild).toHaveBeenCalledWith(mockLink);
    });

    it('should handle document not available', () => {
      const originalDocument = global.document;
      delete (global as any).document;

      const { result } = renderHook(() => useResourcePreloading());

      expect(() => {
        result.current.preloadResource('/app.js', 'script');
        result.current.prefetchResource('/app.js');
      }).not.toThrow();

      global.document = originalDocument;
    });
  });
});