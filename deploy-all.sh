#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "🚀 Starting Pokemon API System Deployment..."

# Create namespace
print_status "Creating namespace..."
kubectl create namespace pokedex --dry-run=client -o yaml | kubectl apply -f -

# Deploy backend
print_status "Deploying backend..."
kubectl apply -f back-end/k8s/deploy-pokedex-backend.yaml

# Deploy frontend
print_status "Deploying frontend..."
kubectl apply -f modern-pokedex/k8s/deploy-pokedex.yaml

# Wait for deployments
print_status "Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/pokedex-backend -n pokedex
kubectl wait --for=condition=available --timeout=300s deployment/modern-pokedex -n pokedex

# Check pod status
print_status "Checking pod status..."
kubectl get pods -n pokedex

# Show services
print_status "Services available:"
kubectl get services -n pokedex

# Show access information
print_success "🎉 Deployment completed!"
echo ""
echo "📋 Access Information:"
echo "Frontend: http://localhost:30000"
echo "Backend API: http://localhost:30001/api/pokemon"
echo ""
echo "🔍 Useful commands:"
echo "kubectl get pods -n pokedex                 # Check pod status"
echo "kubectl logs -f deployment/modern-pokedex -n pokedex    # Frontend logs"
echo "kubectl logs -f deployment/pokedex-backend -n pokedex   # Backend logs"
echo "kubectl delete namespace pokedex            # Clean up"
