#!/bin/bash

# Pokemon System Test Script

echo "🧪 Testing Pokemon API System..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[✅ PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠️  WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[❌ FAIL]${NC} $1"
}

# Test MongoDB Connection
echo "1. Testing MongoDB Connection..."
cd back-end
if go run test_connection.go > /dev/null 2>&1; then
    print_status "MongoDB connection successful"
else
    print_error "MongoDB connection failed"
    exit 1
fi

# Test API Server
echo "2. Testing API Server..."
if pgrep -f "go run main.go" > /dev/null; then
    print_status "API server is running"
else
    print_warning "API server is not running, starting it..."
    nohup go run main.go > api.log 2>&1 &
    sleep 3
fi

# Test API Endpoints
echo "3. Testing API Endpoints..."

# Test stats endpoint
if curl -s http://localhost:8080/api/pokemon/stats > /dev/null; then
    print_status "Stats endpoint working"
else
    print_error "Stats endpoint failed"
fi

# Test pokemon list endpoint
if curl -s http://localhost:8080/api/pokemon | jq length > /dev/null 2>&1; then
    POKEMON_COUNT=$(curl -s http://localhost:8080/api/pokemon | jq length)
    print_status "Pokemon list endpoint working ($POKEMON_COUNT Pokemon found)"
else
    print_error "Pokemon list endpoint failed"
fi

# Test specific pokemon endpoint
if curl -s http://localhost:8080/api/pokemon/1 | jq .name > /dev/null 2>&1; then
    POKEMON_NAME=$(curl -s http://localhost:8080/api/pokemon/1 | jq -r .name)
    print_status "Pokemon by ID endpoint working (Found: $POKEMON_NAME)"
else
    print_error "Pokemon by ID endpoint failed"
fi

# Test search endpoint
if curl -s "http://localhost:8080/api/pokemon/search?q=pika" | jq length > /dev/null 2>&1; then
    SEARCH_COUNT=$(curl -s "http://localhost:8080/api/pokemon/search?q=pika" | jq length)
    print_status "Search endpoint working ($SEARCH_COUNT results for 'pika')"
else
    print_error "Search endpoint failed"
fi

# Test Frontend Dependencies
echo "4. Testing Frontend..."
cd ../modern-pokedex

if [ -d "node_modules" ]; then
    print_status "Frontend dependencies installed"
else
    print_warning "Frontend dependencies not installed"
    echo "Run: cd modern-pokedex && npm install"
fi

# Test Frontend Build
if npm run build > /dev/null 2>&1; then
    print_status "Frontend builds successfully"
else
    print_error "Frontend build failed"
fi

echo ""
echo "🎉 System test completed!"
echo ""
echo "To start the full system:"
echo "  ./setup.sh"
echo ""
echo "To stop all servers:"
echo "  ./stop_servers.sh"