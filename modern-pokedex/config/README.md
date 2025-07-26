# Configuration Files

This directory contains all configuration files organized by purpose.

## Structure

- `build/` - Build and bundling configurations
- `lint/` - Code quality and formatting configurations  
- `docker/` - Container configurations
- `test/` - Testing configurations

## Files

### Build Configuration
- `vite.config.ts` - Vite build configuration
- `vitest.config.ts` - Vitest test runner configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

### Linting Configuration
- `.eslintrc.json` - ESLint rules
- `.prettierrc` - Prettier formatting rules
- `eslint.config.js` - Modern ESLint configuration

### Docker Configuration
- `Dockerfile` - Production container
- `Dockerfile.dev` - Development container
- `docker-compose.yml` - Multi-container setup

### Test Configuration
- `playwright.config.ts` - E2E test configuration
- `vitest.config.ts` - Unit test configuration