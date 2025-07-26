import { test, expect } from '@playwright/test';

test.describe('Pokemon Detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pokemon');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to Pokemon detail page', async ({ page }) => {
    // Wait for Pokemon cards to load
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
    
    // Click on first Pokemon card
    const firstCard = page.locator('[data-testid="pokemon-card"]').first();
    const pokemonName = await firstCard.locator('[data-testid="pokemon-name"]').textContent();
    
    await firstCard.click();
    
    // Should navigate to detail page
    await expect(page).toHaveURL(/\/pokemon\/\d+/);
    
    // Should show Pokemon detail
    await expect(page.locator('[data-testid="pokemon-detail"]')).toBeVisible();
    await expect(page.locator('[data-testid="pokemon-name"]')).toContainText(pokemonName || '');
  });

  test('should display Pokemon information correctly', async ({ page }) => {
    // Navigate to specific Pokemon (Pikachu)
    await page.goto('/pokemon/25');
    await page.waitForLoadState('networkidle');
    
    // Should show Pokemon details
    await expect(page.locator('[data-testid="pokemon-detail"]')).toBeVisible();
    await expect(page.locator('[data-testid="pokemon-name"]')).toContainText('pikachu');
    await expect(page.locator('[data-testid="pokemon-number"]')).toContainText('#025');
    
    // Should show Pokemon image
    await expect(page.locator('[data-testid="pokemon-image"]')).toBeVisible();
    
    // Should show Pokemon types
    await expect(page.locator('[data-testid="pokemon-types"]')).toBeVisible();
    await expect(page.locator('[data-testid="type-badge"]')).toHaveCount(1); // Pikachu has 1 type
    
    // Should show Pokemon stats
    await expect(page.locator('[data-testid="pokemon-stats"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-hp"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-attack"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-defense"]')).toBeVisible();
  });

  test('should handle Pokemon not found', async ({ page }) => {
    // Navigate to non-existent Pokemon
    await page.goto('/pokemon/99999');
    await page.waitForLoadState('networkidle');
    
    // Should show error message or redirect
    const errorMessage = page.locator('[data-testid="error-message"]');
    const notFound = page.locator('[data-testid="not-found"]');
    
    const hasError = await errorMessage.isVisible();
    const hasNotFound = await notFound.isVisible();
    
    expect(hasError || hasNotFound).toBe(true);
  });

  test('should navigate back to Pokemon list', async ({ page }) => {
    // Navigate to Pokemon detail
    await page.goto('/pokemon/25');
    await page.waitForLoadState('networkidle');
    
    // Click back button or navigate back
    const backButton = page.locator('[data-testid="back-button"]');
    const breadcrumb = page.locator('[data-testid="breadcrumb-pokemon"]');
    
    if (await backButton.isVisible()) {
      await backButton.click();
    } else if (await breadcrumb.isVisible()) {
      await breadcrumb.click();
    } else {
      await page.goBack();
    }
    
    // Should be back on Pokemon list
    await expect(page).toHaveURL('/pokemon');
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
  });

  test('should display Pokemon abilities', async ({ page }) => {
    await page.goto('/pokemon/25');
    await page.waitForLoadState('networkidle');
    
    // Should show abilities section
    await expect(page.locator('[data-testid="pokemon-abilities"]')).toBeVisible();
    
    // Should have at least one ability
    const abilities = page.locator('[data-testid="ability-item"]');
    await expect(abilities).toHaveCount.toBeGreaterThan(0);
  });

  test('should display Pokemon moves', async ({ page }) => {
    await page.goto('/pokemon/25');
    await page.waitForLoadState('networkidle');
    
    // Should show moves section
    await expect(page.locator('[data-testid="pokemon-moves"]')).toBeVisible();
    
    // Should have moves listed
    const moves = page.locator('[data-testid="move-item"]');
    await expect(moves.first()).toBeVisible();
  });

  test('should handle loading states', async ({ page }) => {
    // Intercept API call to simulate slow loading
    await page.route('**/api/v2/pokemon/25', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });
    
    const navigationPromise = page.goto('/pokemon/25');
    
    // Should show loading spinner
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    
    await navigationPromise;
    await page.waitForLoadState('networkidle');
    
    // Loading should be gone
    await expect(page.locator('[data-testid="loading-spinner"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="pokemon-detail"]')).toBeVisible();
  });
});