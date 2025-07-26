# Step 8: Organize Assets Directory

## Overview
Reorganize the assets directory to have a clear structure for different types of static assets.

## Commands to Run

### 1. Create Asset Subdirectories
```bash
cd modern-pokedex
mkdir -p src/assets/{data,images/{icons,pokemon,ui},styles}
```

### 2. Move Data Files
```bash
# Move Pokemon dataset to data directory
mv src/assets/pokemon_kanto_dataset.json src/assets/data/ 2>/dev/null || echo "File already moved or not found"
```

### 3. Move Image Files
```bash
# Move React logo to UI images
mv src/assets/react.svg src/assets/images/ui/ 2>/dev/null || echo "File already moved or not found"
```

### 4. Create Assets README
```bash
# This will be created as a separate file
touch src/assets/README.md
```

## Expected Result
```
src/assets/
├── data/
│   └── pokemon_kanto_dataset.json
├── images/
│   ├── icons/
│   ├── pokemon/
│   └── ui/
│       └── react.svg
├── styles/
└── README.md
```

## Verification
```bash
# Check the new structure
ls -la src/assets/
ls -la src/assets/data/
ls -la src/assets/images/ui/
```

## Next Step
Continue to [Step 9: Update Import Paths](09-update-import-paths.md)