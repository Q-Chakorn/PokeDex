#!/bin/bash

echo "🚀 Setting up Pokemon API System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Go is installed
if ! command -v go &> /dev/null; then
    print_error "Go is not installed. Please install Go first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_status "Testing MongoDB connection..."
cd back-end
if go run test_connection.go; then
    print_status "MongoDB connection successful!"
else
    print_error "MongoDB connection failed. Please check your MongoDB setup."
    exit 1
fi

print_status "Installing Go dependencies..."
go mod tidy

print_status "Importing Pokemon data to MongoDB..."
if go run import_data.go; then
    print_status "Data import successful!"
else
    print_warning "Data import failed, but continuing..."
fi

print_status "Starting Go API server in background..."
nohup go run main.go > api.log 2>&1 &
API_PID=$!
echo $API_PID > api.pid
print_status "API server started with PID: $API_PID"

# Wait a moment for server to start
sleep 3

# Test API endpoint
print_status "Testing API endpoint..."
if curl -s http://localhost:8080/api/pokemon/stats > /dev/null; then
    print_status "API is responding!"
else
    print_warning "API might not be ready yet. Check api.log for details."
fi

cd ../modern-pokedex

print_status "Installing Node.js dependencies..."
npm install

print_status "Starting React development server..."
print_status "Frontend will be available at: http://localhost:5173"
print_status "API is available at: http://localhost:8080"

echo ""
print_status "Setup completed! 🎉"
echo ""
echo "To stop the API server later, run:"
echo "kill \$(cat back-end/api.pid)"
echo ""
echo "Starting frontend development server..."
npm run dev