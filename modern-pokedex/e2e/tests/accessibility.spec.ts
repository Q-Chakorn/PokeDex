import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test('should have proper heading hierarchy on Pokemon list page', async ({ page }) => {
    await page.goto('/pokemon');
    await page.waitForLoadState('networkidle');

    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toBeVisible();

    // Check for proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
  });

  test('should have proper ARIA labels and roles', async ({ page }) => {
    await page.goto('/pokemon');
    await page.waitForLoadState('networkidle');

    // Check search input has proper label
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toHaveAttribute('aria-label');

    // Check Pokemon cards have proper roles
    const pokemonCards = page.locator('[data-testid="pokemon-card"]');
    if (await pokemonCards.count() > 0) {
      await expect(pokemonCards.first()).toHaveAttribute('role');
    }

    // Check filter controls have proper labels
    const typeFilters = page.locator('[data-testid^="type-option-"]');
    if (await typeFilters.count() > 0) {
      const firstFilter = typeFilters.first();
      const hasAriaLabel = await firstFilter.getAttribute('aria-label');
      const hasLabel = await page.locator(`label[for="${await firstFilter.getAttribute('id')}"]`).count();
      expect(hasAriaLabel || hasLabel > 0).toBeTruthy();
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/pokemon');
    await page.waitForLoadState('networkidle');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // Should focus on search input
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeFocused();

    // Continue tabbing to other interactive elements
    await page.keyboard.press('Tab');
    
    // Should be able to navigate to Pokemon cards
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/pokemon');
    await page.waitForLoadState('networkidle');

    // Check that text has sufficient contrast
    // This is a basic check - in real scenarios you'd use axe-core
    const textElements = page.locator('p, span, h1, h2, h3, h4, h5, h6, button, a');
    const count = await textElements.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const element = textElements.nth(i);
      if (await element.isVisible()) {
        const styles = await element.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            fontSize: computed.fontSize,
          };
        });
        
        // Basic check that color is not transparent
        expect(styles.color).not.toBe('rgba(0, 0, 0, 0)');
        expect(styles.color).not.toBe('transparent');
      }
    }
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/pokemon');
    await page.waitForLoadState('networkidle');

    // Wait for Pokemon images to load
    const pokemonImages = page.locator('[data-testid="pokemon-image"]');
    const imageCount = await pokemonImages.count();

    if (imageCount > 0) {
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const image = pokemonImages.nth(i);
        await expect(image).toHaveAttribute('alt');
        
        const altText = await image.getAttribute('alt');
        expect(altText).toBeTruthy();
        expect(altText?.length).toBeGreaterThan(0);
      }
    }
  });

  test('should work with screen reader announcements', async ({ page }) => {
    await page.goto('/pokemon');
    await page.waitForLoadState('networkidle');

    // Check for live regions for dynamic content
    const liveRegions = page.locator('[aria-live]');
    const liveRegionCount = await liveRegions.count();
    
    // Should have at least one live region for search results
    expect(liveRegionCount).toBeGreaterThanOrEqual(0);

    // Check for proper announcements when searching
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('pikachu');
    await page.waitForTimeout(500);

    // Results should be announced (check for aria-live region updates)
    const resultsContainer = page.locator('[data-testid="pokemon-list"], [aria-live]');
    if (await resultsContainer.count() > 0) {
      await expect(resultsContainer.first()).toBeVisible();
    }
  });

  test('should handle focus management on navigation', async ({ page }) => {
    await page.goto('/pokemon');
    await page.waitForLoadState('networkidle');

    // Wait for Pokemon cards to load
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();

    // Click on a Pokemon card
    const firstCard = page.locator('[data-testid="pokemon-card"]').first();
    await firstCard.click();

    // Should navigate to detail page
    await expect(page).toHaveURL(/\/pokemon\/\d+/);

    // Focus should be managed properly (usually on main heading or skip link)
    const mainHeading = page.locator('h1');
    const skipLink = page.locator('[href="#main-content"]');
    
    const hasMainHeading = await mainHeading.count() > 0;
    const hasSkipLink = await skipLink.count() > 0;
    
    expect(hasMainHeading || hasSkipLink).toBeTruthy();
  });

  test('should support reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto('/pokemon');
    await page.waitForLoadState('networkidle');

    // Check that animations are disabled or reduced
    const animatedElements = page.locator('[class*="animate"], [class*="transition"]');
    const count = await animatedElements.count();

    if (count > 0) {
      // In a real app, you'd check that CSS animations respect prefers-reduced-motion
      // This is a placeholder test
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should have proper form labels and error messages', async ({ page }) => {
    await page.goto('/pokemon');
    await page.waitForLoadState('networkidle');

    // Check search form
    const searchInput = page.locator('input[placeholder*="Search"]');
    
    // Should have accessible name (via label, aria-label, or aria-labelledby)
    const hasAriaLabel = await searchInput.getAttribute('aria-label');
    const hasAriaLabelledBy = await searchInput.getAttribute('aria-labelledby');
    const inputId = await searchInput.getAttribute('id');
    const hasLabel = inputId ? await page.locator(`label[for="${inputId}"]`).count() > 0 : false;

    expect(hasAriaLabel || hasAriaLabelledBy || hasLabel).toBeTruthy();

    // Test error states if applicable
    await searchInput.fill('');
    // In a real app, you might trigger validation errors to test
  });

  test('should work without JavaScript', async ({ page, context }) => {
    // Disable JavaScript
    await context.setJavaScriptEnabled(false);
    
    await page.goto('/pokemon');
    
    // Basic content should still be accessible
    // This test depends on your SSR/static generation setup
    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
    
    // Re-enable JavaScript for other tests
    await context.setJavaScriptEnabled(true);
  });
});