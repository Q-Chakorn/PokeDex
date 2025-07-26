# Step 6: Create Development Scripts

## Overview
Create development utility scripts for setup and cleanup.

## Commands to Run

### 1. Create Setup Script
Create the file `scripts/dev/setup.sh`:

```bash
cat > scripts/dev/setup.sh << 'EOF'
#!/bin/bash

# Modern Pokédx - Development Setup Script
set -e

echo "🚀 Setting up Modern Pokédx development environment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check Node.js version
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version check passed: $(node -v)"

# Check npm version
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed."
    exit 1
fi

print_status "npm version: $(npm -v)"

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file from template..."
    cp .env.example .env
else
    print_warning ".env file already exists"
fi

# Install Playwright browsers
if command -v npx playwright &> /dev/null; then
    print_status "Installing Playwright browsers..."
    npx playwright install --with-deps
else
    print_warning "Playwright not found, skipping browser installation"
fi

# Run initial build to verify setup
print_status "Running initial build to verify setup..."
npm run build

# Run tests to verify everything works
print_status "Running tests to verify setup..."
npm run test:run

print_status "Development environment setup completed! 🎉"

echo ""
echo "📋 Next steps:"
echo "1. Start development server: npm run dev"
echo "2. Run tests: npm run test"
echo "3. Run E2E tests: npm run test:e2e"
echo "4. Build for production: npm run build"
echo ""
echo "📚 Documentation:"
echo "- README.md - Project overview"
echo "- docs/TESTING.md - Testing guide"
echo "- docs/DOCKER.md - Docker guide"
echo ""
echo "Happy coding! 🚀"
EOF
```

### 2. Create Clean Script
Create the file `scripts/dev/clean.sh`:

```bash
cat > scripts/dev/clean.sh << 'EOF'
#!/bin/bash

# Modern Pokédx - Clean Script
set -e

echo "🧹 Cleaning Modern Pokédx project..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Remove build artifacts
if [ -d "dist" ]; then
    print_status "Removing dist directory..."
    rm -rf dist
fi

# Remove test results
if [ -d "test-results" ]; then
    print_status "Removing test-results directory..."
    rm -rf test-results
fi

# Remove coverage reports
if [ -d "coverage" ]; then
    print_status "Removing coverage directory..."
    rm -rf coverage
fi

# Remove Playwright reports
if [ -d "playwright-report" ]; then
    print_status "Removing playwright-report directory..."
    rm -rf playwright-report
fi

# Remove node_modules if requested
if [ "$1" = "--all" ] || [ "$1" = "-a" ]; then
    if [ -d "node_modules" ]; then
        print_status "Removing node_modules directory..."
        rm -rf node_modules
    fi
    
    if [ -f "package-lock.json" ]; then
        print_status "Removing package-lock.json..."
        rm package-lock.json
    fi
    
    print_warning "Run 'npm install' to reinstall dependencies"
fi

# Clean npm cache
print_status "Cleaning npm cache..."
npm cache clean --force

# Clean TypeScript build info
if [ -f "tsconfig.tsbuildinfo" ]; then
    print_status "Removing TypeScript build info..."
    rm tsconfig.tsbuildinfo
fi

# Clean Vite cache
if [ -d "node_modules/.vite" ]; then
    print_status "Removing Vite cache..."
    rm -rf node_modules/.vite
fi

print_status "Project cleaned successfully! ✨"

echo ""
echo "📋 What was cleaned:"
echo "- Build artifacts (dist/)"
echo "- Test results (test-results/, coverage/)"
echo "- Cache files (.vite/, npm cache)"
echo "- TypeScript build info"

if [ "$1" = "--all" ] || [ "$1" = "-a" ]; then
    echo "- Dependencies (node_modules/, package-lock.json)"
fi

echo ""
echo "💡 Usage:"
echo "  ./scripts/dev/clean.sh        # Clean build artifacts and cache"
echo "  ./scripts/dev/clean.sh --all  # Clean everything including dependencies"
EOF
```

### 3. Make Scripts Executable
```bash
chmod +x scripts/dev/setup.sh
chmod +x scripts/dev/clean.sh
```

## Expected Result
Development scripts should be created and executable:

```
scripts/
└── dev/
    ├── setup.sh
    └── clean.sh
```

## Verification
Check that scripts were created and are executable:
```bash
ls -la scripts/dev/
file scripts/dev/setup.sh
file scripts/dev/clean.sh
```

## Next Step
Proceed to [Step 7: Create Test Scripts](07-create-test-scripts.md)