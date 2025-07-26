#!/bin/bash

# Modern Pokédex - Development Setup Script
set -e

echo "🚀 Setting up Modern Pokédex development environment..."

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