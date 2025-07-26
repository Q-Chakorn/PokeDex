# Testing Guide

This document provides comprehensive information about testing in the Modern Pokédex application.

## Table of Contents

- [Overview](#overview)
- [Test Types](#test-types)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Coverage](#coverage)
- [CI/CD](#cicd)
- [Best Practices](#best-practices)

## Overview

The Modern Pokédex uses a comprehensive testing strategy that includes:

- **Unit Tests**: Testing individual components and utilities
- **Integration Tests**: Testing component interactions
- **End-to-End Tests**: Testing complete user workflows
- **Performance Tests**: Testing application performance
- **Accessibility Tests**: Testing accessibility compliance

## Test Types

### Unit Tests

Unit tests are located alongside the source code in `__tests__` directories and use the `.test.ts` or `.test.tsx` extension.

**Technologies:**
- Vitest as test runner
- React Testing Library for component testing
- Jest DOM for additional matchers

**Example:**
```typescript
import { render, screen } from '@testing-library/react';
import { PokemonCard } from '../PokemonCard';

test('renders Pokemon card with name', () => {
  const pokemon = { id: 1, name: 'pikachu', types: ['electric'] };
  render(<PokemonCard pokemon={pokemon} />);
  
  expect(screen.getByText('pikachu')).toBeInTheDocument();
});
```

### Integration Tests

Integration tests verify that multiple components work together correctly.

**Example:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { PokemonListPage } from '../PokemonListPage';

test('filters Pokemon by type', async () => {
  render(<PokemonListPage />);
  
  fireEvent.click(screen.getByLabelText('Electric type'));
  
  await waitFor(() => {
    expect(screen.getByText('pikachu')).toBeInTheDocument();
  });
});
```

### End-to-End Tests

E2E tests are located in the `e2e/tests` directory and use Playwright.

**Example:**
```typescript
import { test, expect } from '@playwright/test';

test('should search for Pokemon', async ({ page }) => {
  await page.goto('/pokemon');
  await page.fill('input[placeholder*="Search"]', 'pikachu');
  await expect(page.locator('[data-testid="pokemon-card"]')).toHaveCount(1);
});
```

### Performance Tests

Performance tests measure application performance metrics.

**Example:**
```typescript
test('should load Pokemon list within acceptable time', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/pokemon');
  await page.waitForLoadState('networkidle');
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(5000);
});
```

### Accessibility Tests

Accessibility tests ensure the application is usable by everyone.

**Example:**
```typescript
test('should have proper ARIA labels', async ({ page }) => {
  await page.goto('/pokemon');
  const searchInput = page.locator('input[placeholder*="Search"]');
  await expect(searchInput).toHaveAttribute('aria-label');
});
```

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- pokemon.test.tsx

# Run tests matching pattern
npm run test -- --grep "Pokemon"
```

### End-to-End Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e:headed

# Debug E2E tests
npm run test:e2e:debug

# Run specific test file
npx playwright test pokemon-search.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
```

### All Tests

```bash
# Run complete test suite (CI script)
./scripts/test-ci.sh
```

## Writing Tests

### Test Structure

Follow the AAA pattern:
- **Arrange**: Set up test data and conditions
- **Act**: Execute the code being tested
- **Assert**: Verify the results

```typescript
test('should calculate total correctly', () => {
  // Arrange
  const items = [{ price: 10 }, { price: 20 }];
  
  // Act
  const total = calculateTotal(items);
  
  // Assert
  expect(total).toBe(30);
});
```

### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('should handle user interaction', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  
  render(<SearchForm onSubmit={onSubmit} />);
  
  await user.type(screen.getByRole('textbox'), 'pikachu');
  await user.click(screen.getByRole('button', { name: /search/i }));
  
  expect(onSubmit).toHaveBeenCalledWith('pikachu');
});
```

### Mocking

```typescript
// Mock external dependencies
vi.mock('../api/pokemon', () => ({
  fetchPokemon: vi.fn().mockResolvedValue(mockPokemonData),
}));

// Mock React hooks
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({ id: '1' }),
}));
```

### Test Data

Create reusable test data:

```typescript
// test/fixtures/pokemon.ts
export const mockPikachu = {
  id: 25,
  name: 'pikachu',
  types: ['electric'],
  stats: {
    hp: 35,
    attack: 55,
    defense: 40,
  },
};
```

## Coverage

### Coverage Thresholds

The project maintains high coverage standards:

- **Global**: 80% for all metrics
- **Components**: 85% for all metrics
- **Utils**: 90% for all metrics
- **Hooks**: 85% for all metrics

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open HTML coverage report
open coverage/index.html
```

### Coverage Exclusions

The following are excluded from coverage:
- Configuration files
- Test files
- Type definitions
- Build artifacts
- Documentation

## CI/CD

### GitHub Actions

The project uses GitHub Actions for continuous integration:

```yaml
# .github/workflows/ci.yml
- name: Run tests
  run: npm run test:coverage

- name: Run E2E tests
  run: npm run test:e2e
```

### Test Pipeline

1. **Lint**: Code style and quality checks
2. **Type Check**: TypeScript compilation
3. **Unit Tests**: Component and utility tests
4. **Build**: Application build verification
5. **E2E Tests**: End-to-end user workflows
6. **Performance**: Lighthouse audits
7. **Security**: Dependency vulnerability scans

## Best Practices

### General

1. **Write tests first** (TDD approach when possible)
2. **Test behavior, not implementation**
3. **Use descriptive test names**
4. **Keep tests simple and focused**
5. **Avoid testing third-party libraries**

### Unit Tests

1. **Test one thing at a time**
2. **Use meaningful assertions**
3. **Mock external dependencies**
4. **Test edge cases and error conditions**
5. **Keep tests fast and isolated**

### E2E Tests

1. **Test critical user journeys**
2. **Use data-testid attributes for reliable selectors**
3. **Wait for elements properly**
4. **Test across different browsers**
5. **Keep tests stable and maintainable**

### Performance Tests

1. **Set realistic performance budgets**
2. **Test on different network conditions**
3. **Monitor Core Web Vitals**
4. **Test with realistic data volumes**
5. **Measure both cold and warm loads**

### Accessibility Tests

1. **Test with keyboard navigation**
2. **Verify ARIA attributes**
3. **Check color contrast**
4. **Test with screen readers**
5. **Validate semantic HTML**

## Debugging Tests

### Unit Tests

```bash
# Debug with VS Code
# Add breakpoints and run "Debug Test" in VS Code

# Debug with console logs
console.log(screen.debug()); // Print DOM
```

### E2E Tests

```bash
# Debug mode
npm run test:e2e:debug

# Headed mode (see browser)
npm run test:e2e:headed

# Trace viewer
npx playwright show-trace trace.zip
```

## Troubleshooting

### Common Issues

1. **Tests timing out**: Increase timeout or improve waiting strategies
2. **Flaky tests**: Add proper waits and make tests more deterministic
3. **Mock issues**: Ensure mocks are properly reset between tests
4. **Coverage gaps**: Add tests for uncovered branches and functions

### Performance Issues

1. **Slow tests**: Optimize test setup and teardown
2. **Memory leaks**: Ensure proper cleanup in tests
3. **Parallel execution**: Configure test runners for optimal performance

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)