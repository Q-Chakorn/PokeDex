import { test, expect } from '@playwright/test';

test.describe('Pokemon Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pokemon');
    await page.waitForLoadState('networkidle');
  });

  test('should filter Pokemon by type', async ({ page }) => {
    // Wait for Pokemon to load
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
    const initialCount = await page.locator('[data-testid="pokemon-card"]').count();
    
    // Open type filter
    const typeFilter = page.locator('[data-testid="type-filter"]');
    await expect(typeFilter).toBeVisible();
    
    // Select Electric type
    const electricType = page.locator('[data-testid="type-option-electric"]');
    await electricType.click();
    
    // Wait for filter to apply
    await page.waitForTimeout(500);
    
    // Should show fewer Pokemon
    const filteredCount = await page.locator('[data-testid="pokemon-card"]').count();
    expect(filteredCount).toBeLessThan(initialCount);
    expect(filteredCount).toBeGreaterThan(0);
    
    // All visible Pokemon should have Electric type
    const pokemonCards = page.locator('[data-testid="pokemon-card"]');
    const count = await pokemonCards.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const card = pokemonCards.nth(i);
      const typeBadges = card.locator('[data-testid="type-badge"]');
      const electricBadge = typeBadges.filter({ hasText: 'electric' });
      await expect(electricBadge).toHaveCount.toBeGreaterThan(0);
    }
  });

  test('should filter Pokemon by multiple types', async ({ page }) => {
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
    
    // Select multiple types
    await page.locator('[data-testid="type-option-fire"]').click();
    await page.locator('[data-testid="type-option-water"]').click();
    
    await page.waitForTimeout(500);
    
    // Should show Pokemon with either Fire or Water type
    const pokemonCards = page.locator('[data-testid="pokemon-card"]');
    const count = await pokemonCards.count();
    expect(count).toBeGreaterThan(0);
    
    // Check that visible Pokemon have Fire or Water type
    for (let i = 0; i < Math.min(count, 3); i++) {
      const card = pokemonCards.nth(i);
      const typeBadges = card.locator('[data-testid="type-badge"]');
      const fireOrWater = typeBadges.filter({ hasText: /fire|water/ });
      await expect(fireOrWater).toHaveCount.toBeGreaterThan(0);
    }
  });

  test('should clear type filters', async ({ page }) => {
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
    const initialCount = await page.locator('[data-testid="pokemon-card"]').count();
    
    // Apply filter
    await page.locator('[data-testid="type-option-grass"]').click();
    await page.waitForTimeout(500);
    
    const filteredCount = await page.locator('[data-testid="pokemon-card"]').count();
    expect(filteredCount).toBeLessThan(initialCount);
    
    // Clear filters
    const clearButton = page.locator('[data-testid="clear-filters"]');
    if (await clearButton.isVisible()) {
      await clearButton.click();
    } else {
      // Uncheck the grass type
      await page.locator('[data-testid="type-option-grass"]').click();
    }
    
    await page.waitForTimeout(500);
    
    // Should show all Pokemon again
    const finalCount = await page.locator('[data-testid="pokemon-card"]').count();
    expect(finalCount).toBe(initialCount);
  });

  test('should combine search and type filters', async ({ page }) => {
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
    
    // Apply type filter first
    await page.locator('[data-testid="type-option-electric"]').click();
    await page.waitForTimeout(500);
    
    const typeFilteredCount = await page.locator('[data-testid="pokemon-card"]').count();
    
    // Then apply search
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('pika');
    await page.waitForTimeout(500);
    
    // Should show Pokemon that match both criteria
    const combinedCount = await page.locator('[data-testid="pokemon-card"]').count();
    expect(combinedCount).toBeLessThanOrEqual(typeFilteredCount);
    
    // Should show Pikachu (Electric type with "pika" in name)
    if (combinedCount > 0) {
      const firstCard = page.locator('[data-testid="pokemon-card"]').first();
      await expect(firstCard).toContainText('pikachu');
    }
  });

  test('should show filter panel on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Filter panel should be hidden initially on mobile
    const filterPanel = page.locator('[data-testid="filter-panel"]');
    const isVisible = await filterPanel.isVisible();
    
    if (!isVisible) {
      // Should have a button to show filters
      const filterButton = page.locator('[data-testid="show-filters"]');
      await expect(filterButton).toBeVisible();
      
      await filterButton.click();
      await expect(filterPanel).toBeVisible();
    }
  });

  test('should persist filters in URL', async ({ page }) => {
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
    
    // Apply filters
    await page.locator('[data-testid="type-option-fire"]').click();
    await page.waitForTimeout(500);
    
    // URL should contain filter parameters
    const url = page.url();
    expect(url).toContain('type=fire');
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Filter should still be applied
    const fireTypeOption = page.locator('[data-testid="type-option-fire"]');
    await expect(fireTypeOption).toBeChecked();
  });

  test('should show no results when filters match nothing', async ({ page }) => {
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
    
    // Apply very specific search that won't match anything
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('nonexistentpokemon');
    await page.waitForTimeout(500);
    
    // Should show no results message
    await expect(page.locator('[data-testid="no-results"]')).toBeVisible();
    await expect(page.locator('[data-testid="pokemon-card"]')).toHaveCount(0);
  });
});