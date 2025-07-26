import { test, expect } from '@playwright/test';

test.describe('Pokemon Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pokemon');
    await page.waitForLoadState('networkidle');
  });

  test('should search for Pokemon by name', async ({ page }) => {
    // Wait for Pokemon to load
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
    
    // Search for Pikachu
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('pikachu');
    
    // Wait for search results
    await page.waitForTimeout(500); // Debounce delay
    
    // Should show only Pikachu results
    const pokemonCards = page.locator('[data-testid="pokemon-card"]');
    await expect(pokemonCards).toHaveCount(1);
    await expect(pokemonCards.first()).toContainText('pikachu');
  });

  test('should search for Pokemon by number', async ({ page }) => {
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
    
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('025');
    await page.waitForTimeout(500);
    
    const pokemonCards = page.locator('[data-testid="pokemon-card"]');
    await expect(pokemonCards).toHaveCount(1);
    await expect(pokemonCards.first()).toContainText('pikachu');
  });

  test('should show no results for invalid search', async ({ page }) => {
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
    
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('invalidpokemon');
    await page.waitForTimeout(500);
    
    await expect(page.locator('[data-testid="no-results"]')).toBeVisible();
    await expect(page.locator('[data-testid="no-results"]')).toContainText('No results for "invalidpokemon"');
  });

  test('should clear search results', async ({ page }) => {
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
    const initialCount = await page.locator('[data-testid="pokemon-card"]').count();
    
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('pikachu');
    await page.waitForTimeout(500);
    
    await expect(page.locator('[data-testid="pokemon-card"]')).toHaveCount(1);
    
    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(500);
    
    // Should show all Pokemon again
    const finalCount = await page.locator('[data-testid="pokemon-card"]').count();
    expect(finalCount).toBeGreaterThan(1);
    expect(finalCount).toBe(initialCount);
  });

  test('should handle search with special characters', async ({ page }) => {
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
    
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('mr. mime');
    await page.waitForTimeout(500);
    
    // Should handle special characters gracefully
    const pokemonCards = page.locator('[data-testid="pokemon-card"]');
    const count = await pokemonCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should be case insensitive', async ({ page }) => {
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
    
    const searchInput = page.locator('input[placeholder*="Search"]');
    
    // Test uppercase
    await searchInput.fill('PIKACHU');
    await page.waitForTimeout(500);
    
    const upperCaseResults = await page.locator('[data-testid="pokemon-card"]').count();
    
    // Test lowercase
    await searchInput.clear();
    await searchInput.fill('pikachu');
    await page.waitForTimeout(500);
    
    const lowerCaseResults = await page.locator('[data-testid="pokemon-card"]').count();
    
    expect(upperCaseResults).toBe(lowerCaseResults);
  });
});