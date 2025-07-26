# Step 9: Update Import Paths

## Overview
Update import paths in the codebase to reflect the new file locations after reorganization.

## Commands to Run

### 1. Update Pokemon Service Import
```bash
cd modern-pokedex

# Update the import path in PokemonService.ts
# Change: import pokemonDataset from '../assets/pokemon_kanto_dataset.json';
# To: import pokemonDataset from '../assets/data/pokemon_kanto_dataset.json';
```

### 2. Update Package.json Scripts
```bash
# Update scripts to use new config locations
# This involves updating the package.json file to reference new paths
```

### 3. Check for Other Import References
```bash
# Search for any other references to moved files
grep -r "pokemon_kanto_dataset" src/ || echo "No additional references found"
grep -r "react.svg" src/ || echo "No additional references found"
```

## Files to Update

### src/services/PokemonService.ts
```typescript
// Before
import pokemonDataset from '../assets/pokemon_kanto_dataset.json';

// After  
import pokemonDataset from '../assets/data/pokemon_kanto_dataset.json';
```

### package.json
```json
{
  "scripts": {
    "test:e2e": "playwright test --config=config/test/playwright.config.ts",
    "analyze": "node scripts/build/analyze-bundle.js",
    "docker:build": "./scripts/docker/docker-build.sh",
    "docker:dev": "./scripts/docker/docker-dev.sh"
  }
}
```

## Verification
```bash
# Test that imports work correctly
npm run build
npm run test:run
```

## Next Step
Continue to [Step 10: Create Barrel Exports](10-create-barrel-exports.md)