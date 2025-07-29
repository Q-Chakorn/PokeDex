#!/bin/bash

# Build script for PokeDex Docker images
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCKER_REGISTRY=${DOCKER_REGISTRY:-"chakorn"}
VERSION=${VERSION:-"1.0.6"}
PLATFORM=${PLATFORM:-"linux/amd64,linux/arm64"}

echo -e "${BLUE}🚀 Building PokeDex Docker Images${NC}"
echo -e "${BLUE}=================================${NC}"
echo -e "Registry: ${DOCKER_REGISTRY}"
echo -e "Version: ${VERSION}"
echo -e "Platform: ${PLATFORM}"
echo ""

# Function to build image
build_image() {
    local service=$1
    local context_dir=$2
    local dockerfile=$3
    
    echo -e "${YELLOW}📦 Building ${service}...${NC}"
    
    # Build for multiple platforms
    docker buildx build \
        --platform ${PLATFORM} \
        --tag ${DOCKER_REGISTRY}/${service}:${VERSION} \
        --tag ${DOCKER_REGISTRY}/${service}:latest \
        --file ${dockerfile} \
        --push \
        ${context_dir}
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ ${service} built successfully!${NC}"
    else
        echo -e "${RED}❌ Failed to build ${service}${NC}"
        exit 1
    fi
    echo ""
}

# Build backend
echo -e "${BLUE}Building Backend...${NC}"
build_image "pokedex-backend" "./back-end" "./back-end/Dockerfile"

# Build frontend
echo -e "${BLUE}Building Frontend...${NC}"
build_image "modern-pokedex" "./modern-pokedex" "./modern-pokedex/Dockerfile"

echo -e "${GREEN}🎉 All images built successfully!${NC}"
echo -e "${GREEN}=================================${NC}"
echo -e "Images available:"
echo -e "- ${DOCKER_REGISTRY}/pokedex-backend:${VERSION}"
echo -e "- ${DOCKER_REGISTRY}/modern-pokedex:${VERSION}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Update Kubernetes deployment files with new version"
echo -e "2. Run: kubectl apply -f k8s/"
echo -e "3. Check deployment: kubectl get pods -n pokedex"
