#!/bin/bash

# Pokemon Frontend Development Script

echo "🚀 Starting Pokemon Frontend Development..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if API server is running
if ! curl -s http://localhost:8080/api/pokemon/stats > /dev/null; then
    print_warning "API server is not running at http://localhost:8080"
    print_warning "Please start the Go API server first:"
    echo "  cd back-end && go run main.go"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    print_status "API server is running ✅"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
fi

# Check for updates
print_status "Checking for dependency updates..."
npm outdated

# Run linting
print_status "Running linter..."
npm run lint

# Run tests
print_status "Running tests..."
npm run test:run

# Start development server
print_status "Starting development server..."
print_status "Frontend will be available at: http://localhost:5173"
print_status "API is available at: http://localhost:8080"

npm run dev