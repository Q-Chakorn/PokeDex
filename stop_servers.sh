#!/bin/bash

echo "🛑 Stopping Pokemon API servers..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Stop Go API server
if [ -f "back-end/api.pid" ]; then
    API_PID=$(cat back-end/api.pid)
    if kill -0 $API_PID 2>/dev/null; then
        kill $API_PID
        print_status "Stopped API server (PID: $API_PID)"
        rm back-end/api.pid
    else
        print_warning "API server was not running"
        rm back-end/api.pid
    fi
else
    print_warning "No API server PID file found"
fi

# Kill any remaining Go processes running main.go
pkill -f "go run main.go" 2>/dev/null && print_status "Killed any remaining Go processes"

# Kill any processes using port 8080
lsof -ti:8080 | xargs kill -9 2>/dev/null && print_status "Freed port 8080"

# Kill any processes using port 5173 (Vite dev server)
lsof -ti:5173 | xargs kill -9 2>/dev/null && print_status "Freed port 5173"

print_status "All servers stopped! 🎉"