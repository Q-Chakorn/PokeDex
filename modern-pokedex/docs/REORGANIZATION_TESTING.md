# Reorganization Testing Guide

## Overview

This guide provides step-by-step instructions to verify that the Modern Pokédx reorganization didn't break the application functionality.

## 🧪 Testing Checklist

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari)

### Step 1: Environment Setup
```bash
cd modern-pokedex

# Install dependencies
npm ci

# Verify Node.js version
node --version  # Should be 18+
npm --version   # Should be 8+
```

### Step 2: Build Verification
```bash
# Clean any previous builds
npm run clean  # or ./scripts/dev/clean.sh

# Build the application
npm run build

# Verify build artifacts
ls -la dist/
```

**Expected Results:**
- ✅ Build completes without errors
- ✅ `dist/` directory contains HTML, CSS, JS files
- ✅ No TypeScript compilation errors

### Step 3: Unit Tests
```bash
# Run unit tests
npm run test:run

# Run with coverage (optional)
npm run test:coverage
```

**Expected Results:**
- ✅ All unit tests pass
- ✅ No import/export errors
- ✅ Coverage reports generated (if using coverage)

### Step 4: Linting and Code Quality
```bash
# Run ESLint
npm run lint

# Check code formatting
npm run format -- --check
```

**Expected Results:**
- ✅ No linting errors
- ✅ Code formatting is consistent
- ✅ No import path issues

### Step 5: Development Server
```bash
# Start development server
npm run dev
```

**Expected Results:**
- ✅ Server starts on http://localhost:3000
- ✅ No console errors in browser
- ✅ Application loads correctly
- ✅ Hot reload works

### Step 6: Application Functionality
Open http://localhost:3000 and verify:

#### Basic Functionality
- [ ] Homepage loads without errors
- [ ] Pokemon list displays correctly
- [ ] Search functionality works
- [ ] Filter functionality works
- [ ] Pokemon detail pages load
- [ ] Navigation works properly

#### UI Components
- [ ] Loading spinners display
- [ ] Error messages show when appropriate
- [ ] Type badges render correctly
- [ ] Images load properly
- [ ] Responsive design works

#### Data Loading
- [ ] Pokemon data loads from JSON file
- [ ] Search returns correct results
- [ ] Filters work as expected
- [ ] Pokemon details show complete information

### Step 7: E2E Tests (Optional)
```bash
# Install Playwright browsers
npx playwright install --with-deps

# Run E2E tests
npm run test:e2e
```

**Expected Results:**
- ✅ All E2E tests pass
- ✅ No navigation errors
- ✅ User interactions work correctly

### Step 8: Production Build Testing
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

**Expected Results:**
- ✅ Production build works
- ✅ Application functions in production mode
- ✅ No console errors

## 🔍 Common Issues and Solutions

### Import Path Errors
If you see import errors:
```bash
# Check for incorrect import paths
grep -r "from.*assets.*pokemon_kanto_dataset" src/
# Should show: from '../assets/data/pokemon_kanto_dataset.json'
```

### Build Failures
If build fails:
```bash
# Clean and reinstall
./scripts/dev/clean.sh --all
npm install
npm run build
```

### Test Failures
If tests fail:
```bash
# Check for missing dependencies
npm audit
npm run test:run -- --reporter=verbose
```

### Configuration Issues
If configs don't work:
```bash
# Verify config files exist
ls -la config/build/
ls -la config/test/
ls -la config/docker/
```

## 📊 Success Criteria

The reorganization is successful if:

- ✅ **Build Process**: Application builds without errors
- ✅ **Tests**: All unit tests pass
- ✅ **Functionality**: Core features work as expected
- ✅ **Performance**: No significant performance degradation
- ✅ **Development**: Dev server starts and hot reload works
- ✅ **Scripts**: All npm scripts execute correctly
- ✅ **Imports**: All import paths resolve correctly

## 🚨 Rollback Plan

If critical issues are found:

1. **Identify the Issue**
   ```bash
   # Check git status
   git status
   git log --oneline -10
   ```

2. **Selective Rollback**
   ```bash
   # Rollback specific files if needed
   git checkout HEAD~1 -- src/services/PokemonService.ts
   git checkout HEAD~1 -- package.json
   ```

3. **Full Rollback** (if necessary)
   ```bash
   # Create backup branch
   git branch reorganization-backup
   
   # Reset to previous state
   git reset --hard HEAD~[number-of-commits]
   ```

## 📝 Test Report Template

Use this template to document your testing results:

```markdown
# Reorganization Test Report

**Date**: [Date]
**Tester**: [Name]
**Environment**: [OS, Node version, Browser]

## Test Results

### Build Verification
- [ ] Build successful
- [ ] No TypeScript errors
- [ ] Artifacts generated

### Unit Tests
- [ ] All tests pass
- [ ] No import errors
- [ ] Coverage acceptable

### Functionality Tests
- [ ] Homepage works
- [ ] Search works
- [ ] Filters work
- [ ] Navigation works

### Issues Found
[List any issues discovered]

### Recommendations
[Any recommendations for improvements]

**Overall Status**: ✅ PASS / ❌ FAIL
```

## 🔄 Continuous Verification

Set up these checks for ongoing verification:

### Pre-commit Hooks
```bash
# Add to .husky/pre-commit
npm run lint
npm run test:run
npm run build
```

### CI Pipeline
Ensure your CI includes:
- Build verification
- Unit tests
- E2E tests
- Bundle size analysis

---

**Last Updated**: January 2025  
**Version**: 1.0.0