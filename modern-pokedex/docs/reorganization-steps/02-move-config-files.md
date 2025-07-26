# Step 2: Move Configuration Files

## Overview
Move all configuration files from the root directory to their appropriate config subdirectories.

## Commands to Run

### 1. Move Build Configuration Files
```bash
# Move Vite and build-related configs
mv vite.config.ts config/build/ 2>/dev/null || echo "vite.config.ts already moved"
mv vitest.config.ts config/build/ 2>/dev/null || echo "vitest.config.ts already moved"
mv tailwind.config.js config/build/ 2>/dev/null || echo "tailwind.config.js already moved"
mv postcss.config.js config/build/ 2>/dev/null || echo "postcss.config.js already moved"
```

### 2. Move Lint Configuration Files
```bash
# Move ESLint and Prettier configs
mv .eslintrc.json config/lint/ 2>/dev/null || echo ".eslintrc.json already moved"
mv .prettierrc config/lint/ 2>/dev/null || echo ".prettierrc already moved"
mv eslint.config.js config/lint/ 2>/dev/null || echo "eslint.config.js already moved"
```

### 3. Move Docker Configuration Files
```bash
# Move Docker-related files
mv Dockerfile* config/docker/ 2>/dev/null || echo "Dockerfile already moved"
mv docker-compose*.yml config/docker/ 2>/dev/null || echo "docker-compose files already moved"
mv nginx.conf config/docker/ 2>/dev/null || echo "nginx.conf already moved"
```

### 4. Move TypeScript Configuration Files
```bash
# Move TypeScript configs
mv tsconfig.json config/typescript/ 2>/dev/null || echo "tsconfig.json already moved"
mv tsconfig.app.json config/typescript/ 2>/dev/null || echo "tsconfig.app.json already moved"
mv tsconfig.build.json config/typescript/ 2>/dev/null || echo "tsconfig.build.json already moved"
mv tsconfig.node.json config/typescript/ 2>/dev/null || echo "tsconfig.node.json already moved"
```

## Expected Result
Configuration files should now be organized in their respective directories:

```
config/
├── build/
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
├── lint/
│   ├── .eslintrc.json
│   ├── .prettierrc
│   └── eslint.config.js
├── docker/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── docker-compose.override.yml
│   └── nginx.conf
└── typescript/
    ├── tsconfig.json
    ├── tsconfig.app.json
    ├── tsconfig.build.json
    └── tsconfig.node.json
```

## Verification
Check that files were moved successfully:
```bash
ls -la config/build/
ls -la config/lint/
ls -la config/docker/
ls -la config/typescript/
```

## Next Step
Proceed to [Step 3: Create Test Configuration](03-create-test-config.md)