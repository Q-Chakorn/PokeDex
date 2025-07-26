# Step 1: Setup Directory Structure

## Overview
Create the main directory structure for organizing configuration files, scripts, and documentation.

## Commands to Run

### 1. Create Config Directories
```bash
mkdir -p config/{build,lint,docker,test,typescript,performance}
```

### 2. Create Scripts Directories
```bash
mkdir -p scripts/{build,docker,test,dev}
```

### 3. Create Documentation Structure
```bash
mkdir -p docs/{development,architecture,deployment,guides,reorganization-steps}
```

### 4. Create Assets Structure
```bash
mkdir -p src/assets/{data,images/{icons,pokemon,ui},styles}
```

## Expected Result
After running these commands, you should have the following directory structure:

```
modern-pokedex/
├── config/
│   ├── build/
│   ├── lint/
│   ├── docker/
│   ├── test/
│   ├── typescript/
│   └── performance/
├── scripts/
│   ├── build/
│   ├── docker/
│   ├── test/
│   └── dev/
├── docs/
│   ├── development/
│   ├── architecture/
│   ├── deployment/
│   ├── guides/
│   └── reorganization-steps/
└── src/assets/
    ├── data/
    ├── images/
    │   ├── icons/
    │   ├── pokemon/
    │   └── ui/
    └── styles/
```

## Verification
Check that directories were created successfully:
```bash
ls -la config/
ls -la scripts/
ls -la docs/
ls -la src/assets/
```

## Next Step
Proceed to [Step 2: Move Configuration Files](02-move-config-files.md)