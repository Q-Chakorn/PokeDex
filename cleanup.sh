#!/bin/bash

# Cleanup script for PokeDex deployment
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

CLEANUP_TYPE=${1:-"all"}  # docker, k8s, all

echo -e "${BLUE}🧹 PokeDex Cleanup${NC}"
echo -e "${BLUE}==================${NC}"

cleanup_docker() {
    echo -e "${YELLOW}🐳 Cleaning up Docker resources...${NC}"
    
    # Stop and remove containers
    echo "Stopping Docker Compose services..."
    docker-compose down --remove-orphans 2>/dev/null || true
    docker-compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true
    
    # Remove containers
    echo "Removing PokeDex containers..."
    docker rm -f pokedex-backend pokedex-backend-prod modern-pokedex modern-pokedex-prod 2>/dev/null || true
    
    # Remove local images (optional)
    read -p "Remove local images? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Removing local images..."
        docker rmi pokedex-backend:latest pokedex-backend:local 2>/dev/null || true
        docker rmi modern-pokedex:latest modern-pokedex:local 2>/dev/null || true
    fi
    
    # Clean up networks
    echo "Cleaning up networks..."
    docker network rm pokedex-network pokedex-network-prod 2>/dev/null || true
    
    # Clean up volumes
    read -p "Remove volumes and data? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Removing volumes..."
        docker volume rm pokedex-backend-data pokedex-backend-data-prod 2>/dev/null || true
    fi
    
    echo -e "${GREEN}✅ Docker cleanup completed!${NC}"
}

cleanup_k8s() {
    echo -e "${YELLOW}☸️  Cleaning up Kubernetes resources...${NC}"
    
    # Check if kubectl is available
    if ! command -v kubectl &> /dev/null; then
        echo -e "${RED}❌ kubectl not found, skipping Kubernetes cleanup${NC}"
        return
    fi
    
    # Delete namespaces (this will delete all resources in them)
    echo "Deleting Kubernetes namespaces..."
    kubectl delete namespace pokedx-local --ignore-not-found=true
    kubectl delete namespace pokedex --ignore-not-found=true
    
    # Wait for namespaces to be fully deleted
    echo "Waiting for namespaces to be deleted..."
    kubectl wait --for=delete namespace/pokedex-local --timeout=60s 2>/dev/null || true
    kubectl wait --for=delete namespace/pokedex --timeout=60s 2>/dev/null || true
    
    echo -e "${GREEN}✅ Kubernetes cleanup completed!${NC}"
}

cleanup_all() {
    cleanup_docker
    echo
    cleanup_k8s
}

# Main cleanup logic
case $CLEANUP_TYPE in
    "docker")
        cleanup_docker
        ;;
    "k8s"|"kubernetes")
        cleanup_k8s
        ;;
    "all")
        cleanup_all
        ;;
    *)
        echo -e "${RED}❌ Invalid cleanup type: ${CLEANUP_TYPE}${NC}"
        echo -e "${YELLOW}Usage:${NC}"
        echo -e "  $0 [docker|k8s|all]"
        echo -e ""
        echo -e "${YELLOW}Examples:${NC}"
        echo -e "  $0 docker   # Clean up Docker resources only"
        echo -e "  $0 k8s      # Clean up Kubernetes resources only"
        echo -e "  $0 all      # Clean up everything (default)"
        exit 1
        ;;
esac

echo
echo -e "${GREEN}🎉 Cleanup completed!${NC}"
