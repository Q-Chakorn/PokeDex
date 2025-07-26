#!/bin/bash

# Modern Pokédex - Clean Script
set -e

echo "🧹 Cleaning Modern Pokédex project..."

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