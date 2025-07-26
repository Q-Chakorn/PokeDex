import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useDebounce, useDebouncedCallback } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'updated', delay: 500 });
    
    // Should still be initial value
    expect(result.current).toBe('initial');

    // Fast-forward time by less than delay
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    // Should still be initial value
    expect(result.current).toBe('initial');

    // Fast-forward time to complete delay
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    // Should now be updated value
    expect(result.current).toBe('updated');
  });

  it('should reset timer on rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Change value multiple times rapidly
    rerender({ value: 'update1', delay: 500 });
    
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    rerender({ value: 'update2', delay: 500 });
    
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    rerender({ value: 'final', delay: 500 });
    
    // Should still be initial value
    expect(result.current).toBe('initial');
    
    // Complete the delay
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    // Should be the final value
    expect(result.current).toBe('final');
  });

  it('should handle different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 100 } }
    );

    rerender({ value: 'updated', delay: 100 });
    
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    expect(result.current).toBe('updated');
  });

  it('should handle zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 0 } }
    );

    rerender({ value: 'updated', delay: 0 });
    
    act(() => {
      vi.advanceTimersByTime(0);
    });
    
    expect(result.current).toBe('updated');
  });

  it('should work with different data types', () => {
    // Test with numbers
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 1, delay: 100 } }
    );

    numberRerender({ value: 2, delay: 100 });
    
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    expect(numberResult.current).toBe(2);

    // Test with objects
    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: { id: 1 }, delay: 100 } }
    );

    const newObject = { id: 2 };
    objectRerender({ value: newObject, delay: 100 });
    
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    expect(objectResult.current).toBe(newObject);
  });
});

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial callback immediately', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));
    
    expect(result.current).toBe(callback);
  });

  it('should debounce callback changes', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    
    const { result, rerender } = renderHook(
      ({ callback, delay }) => useDebouncedCallback(callback, delay),
      { initialProps: { callback: callback1, delay: 500 } }
    );

    expect(result.current).toBe(callback1);

    // Change callback
    rerender({ callback: callback2, delay: 500 });
    
    // Should still be callback1
    expect(result.current).toBe(callback1);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    // Should now be callback2
    expect(result.current).toBe(callback2);
  });

  it('should handle dependencies array', () => {
    const callback = vi.fn();
    
    const { result, rerender } = renderHook(
      ({ deps }) => useDebouncedCallback(callback, 500, deps),
      { initialProps: { deps: [1] } }
    );

    const initialCallback = result.current;

    // Change dependencies
    rerender({ deps: [2] });
    
    // Should still be the same callback reference initially
    expect(result.current).toBe(initialCallback);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    // Should be updated callback
    expect(result.current).toBe(callback);
  });

  it('should reset timer on rapid callback changes', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const callback3 = vi.fn();
    
    const { result, rerender } = renderHook(
      ({ callback, delay }) => useDebouncedCallback(callback, delay),
      { initialProps: { callback: callback1, delay: 500 } }
    );

    // Change callback multiple times rapidly
    rerender({ callback: callback2, delay: 500 });
    
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    rerender({ callback: callback3, delay: 500 });
    
    // Should still be callback1
    expect(result.current).toBe(callback1);
    
    // Complete the delay
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    // Should be callback3
    expect(result.current).toBe(callback3);
  });
});