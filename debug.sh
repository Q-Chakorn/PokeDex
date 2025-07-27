#!/bin/bash

# Pokemon System Debug Script

echo "🔍 Pokemon System Debug Information"
echo "=================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_section() {
    echo -e "\n${BLUE}📋 $1${NC}"
    echo "-----------------------------------"
}

print_info() {
    echo -e "${GREEN}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# System Information
print_section "System Information"
echo "OS: $(uname -s)"
echo "Architecture: $(uname -m)"
echo "Date: $(date)"

# Go Information
print_section "Go Environment"
if command -v go &> /dev/null; then
    print_info "Go version: $(go version)"
    print_info "GOPATH: $GOPATH"
    print_info "GOROOT: $GOROOT"
else
    print_error "Go is not installed"
fi

# Node.js Information
print_section "Node.js Environment"
if command -v node &> /dev/null; then
    print_info "Node.js version: $(node --version)"
    print_info "npm version: $(npm --version)"
else
    print_error "Node.js is not installed"
fi

# MongoDB Connection
print_section "MongoDB Connection"
cd back-end
if [ -f "env.yaml" ]; then
    print_info "Configuration file exists"
    echo "MongoDB Config:"
    cat env.yaml | grep -E "(host|port|database|user)" | sed 's/^/  /'
    
    if go run test_connection.go > /dev/null 2>&1; then
        print_info "MongoDB connection: SUCCESS"
    else
        print_error "MongoDB connection: FAILED"
        echo "Error details:"
        go run test_connection.go 2>&1 | sed 's/^/  /'
    fi
else
    print_error "env.yaml configuration file not found"
fi

# API Server Status
print_section "API Server Status"
if pgrep -f "go run main.go" > /dev/null; then
    PID=$(pgrep -f "go run main.go")
    print_info "API server is running (PID: $PID)"
    
    # Test API endpoints
    if curl -s http://localhost:8080/api/pokemon/stats > /dev/null; then
        print_info "API endpoints are responding"
        
        # Get stats
        STATS=$(curl -s http://localhost:8080/api/pokemon/stats)
        echo "API Stats:"
        echo "$STATS" | jq . 2>/dev/null | sed 's/^/  /' || echo "  $STATS"
    else
        print_error "API endpoints are not responding"
    fi
else
    print_warning "API server is not running"
fi

# Port Usage
print_section "Port Usage"
echo "Port 8080 (API):"
if lsof -i :8080 > /dev/null 2>&1; then
    lsof -i :8080 | sed 's/^/  /'
else
    print_warning "Port 8080 is not in use"
fi

echo "Port 5173 (Frontend):"
if lsof -i :5173 > /dev/null 2>&1; then
    lsof -i :5173 | sed 's/^/  /'
else
    print_warning "Port 5173 is not in use"
fi

# Frontend Status
print_section "Frontend Status"
cd ../modern-pokedex

if [ -d "node_modules" ]; then
    print_info "Dependencies are installed"
    
    # Check package.json
    if [ -f "package.json" ]; then
        print_info "Package.json exists"
        echo "Scripts available:"
        cat package.json | jq -r '.scripts | keys[]' 2>/dev/null | sed 's/^/  - /' || print_warning "Could not parse package.json"
    fi
else
    print_warning "Dependencies are not installed (run: npm install)"
fi

# Log Files
print_section "Log Files"
cd ../back-end

if [ -f "api.log" ]; then
    print_info "API log file exists"
    echo "Last 5 lines of API log:"
    tail -5 api.log | sed 's/^/  /'
else
    print_warning "No API log file found"
fi

if [ -f "api.pid" ]; then
    PID_FILE_CONTENT=$(cat api.pid)
    print_info "PID file exists: $PID_FILE_CONTENT"
    
    if kill -0 $PID_FILE_CONTENT 2>/dev/null; then
        print_info "Process is still running"
    else
        print_warning "Process in PID file is not running"
    fi
else
    print_warning "No PID file found"
fi

# Data Files
print_section "Data Files"
cd ..

if [ -f "pokemon_kanto_dataset.json" ]; then
    FILE_SIZE=$(wc -c < pokemon_kanto_dataset.json)
    print_info "Pokemon dataset exists (${FILE_SIZE} bytes)"
    
    # Count Pokemon in file
    POKEMON_COUNT=$(cat pokemon_kanto_dataset.json | jq length 2>/dev/null)
    if [ "$POKEMON_COUNT" != "" ]; then
        print_info "Dataset contains $POKEMON_COUNT Pokemon"
    fi
else
    print_error "Pokemon dataset file not found"
fi

print_section "Troubleshooting Tips"
echo "1. If MongoDB connection fails:"
echo "   - Check if MongoDB server is running"
echo "   - Verify credentials in back-end/env.yaml"
echo ""
echo "2. If API server won't start:"
echo "   - Check if port 8080 is already in use"
echo "   - Run: cd back-end && go run main.go"
echo ""
echo "3. If frontend won't start:"
echo "   - Run: cd modern-pokedex && npm install"
echo "   - Run: cd modern-pokedex && npm run dev"
echo ""
echo "4. If no data is showing:"
echo "   - Run: cd back-end && go run import_data.go"
echo ""
echo "For more help, check the logs or run ./test_system.sh"