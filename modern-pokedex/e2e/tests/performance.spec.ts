import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load Pokemon list page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/pokemon');
    await page.waitForLoadState('networkidle');
    
    // Wait for Pokemon cards to be visible
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    console.log(`Pokemon list loaded in ${loadTime}ms`);
  });

  test('should load Pokemon detail page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/pokemon/25');
    await page.waitForLoadState('networkidle');
    
    // Wait for Pokemon detail to be visible
    await expect(page.locator('[data-testid="pokemon-detail"]')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    console.log(`Pokemon detail loaded in ${loadTime}ms`);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    // Navigate to the page
    await page.goto('/pokemon');
    
    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics: any = {};
          
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              metrics.loadTime = navEntry.loadEventEnd - navEntry.loadEventStart;
              metrics.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart;
              metrics.firstByte = navEntry.responseStart - navEntry.requestStart;
            }
          });
          
          resolve(metrics);
        });
        
        observer.observe({ entryTypes: ['navigation'] });
        
        // Fallback timeout
        setTimeout(() => resolve({}), 5000);
      });
    });
    
    console.log('Performance metrics:', metrics);
    
    // Basic performance assertions
    if (metrics.loadTime) {
      expect(metrics.loadTime).toBeLessThan(2000); // Load event should complete within 2s
    }
    
    if (metrics.firstByte) {
      expect(metrics.firstByte).toBeLessThan(1000); // TTFB should be under 1s
    }
  });

  test('should handle large lists efficiently', async ({ page }) => {
    await page.goto('/pokemon');
    await page.waitForLoadState('networkidle');
    
    // Wait for initial Pokemon to load
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
    
    const startTime = Date.now();
    
    // Scroll to load more Pokemon (if pagination/infinite scroll is implemented)
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Wait a bit for any lazy loading
    await page.waitForTimeout(1000);
    
    const scrollTime = Date.now() - startTime;
    
    // Scrolling should be smooth and fast
    expect(scrollTime).toBeLessThan(2000);
    console.log(`Scroll performance: ${scrollTime}ms`);
  });

  test('should search efficiently', async ({ page }) => {
    await page.goto('/pokemon');
    await page.waitForLoadState('networkidle');
    
    // Wait for Pokemon to load
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
    
    const searchInput = page.locator('input[placeholder*="Search"]');
    
    const startTime = Date.now();
    
    // Type search query
    await searchInput.fill('pikachu');
    
    // Wait for search results
    await page.waitForTimeout(500); // Account for debounce
    await expect(page.locator('[data-testid="pokemon-card"]')).toHaveCount(1);
    
    const searchTime = Date.now() - startTime;
    
    // Search should be fast
    expect(searchTime).toBeLessThan(1000);
    console.log(`Search performance: ${searchTime}ms`);
  });

  test('should filter efficiently', async ({ page }) => {
    await page.goto('/pokemon');
    await page.waitForLoadState('networkidle');
    
    // Wait for Pokemon to load
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
    
    const startTime = Date.now();
    
    // Apply type filter
    await page.locator('[data-testid="type-option-electric"]').click();
    
    // Wait for filter to apply
    await page.waitForTimeout(500);
    
    const filterTime = Date.now() - startTime;
    
    // Filtering should be fast
    expect(filterTime).toBeLessThan(1000);
    console.log(`Filter performance: ${filterTime}ms`);
  });

  test('should have acceptable bundle size', async ({ page }) => {
    // Navigate to the page and measure resource sizes
    await page.goto('/pokemon');
    
    const resourceSizes = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsResources = resources.filter(r => r.name.includes('.js'));
      const cssResources = resources.filter(r => r.name.includes('.css'));
      
      const totalJSSize = jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const totalCSSSize = cssResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      
      return {
        totalJS: totalJSSize,
        totalCSS: totalCSSSize,
        total: totalJSSize + totalCSSSize,
        jsFiles: jsResources.length,
        cssFiles: cssResources.length
      };
    });
    
    console.log('Bundle sizes:', resourceSizes);
    
    // Bundle size assertions (adjust based on your requirements)
    expect(resourceSizes.totalJS).toBeLessThan(1024 * 1024); // JS under 1MB
    expect(resourceSizes.totalCSS).toBeLessThan(256 * 1024); // CSS under 256KB
    expect(resourceSizes.total).toBeLessThan(1.5 * 1024 * 1024); // Total under 1.5MB
  });
});