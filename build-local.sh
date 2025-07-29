#!/bin/bash

# Local build script for PokeDex
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
VERSION=${VERSION:-"local"}

echo -e "${BLUE}🏠 Building PokeDex for Local Development${NC}"
echo -e "${BLUE}=========================================${NC}"
echo -e "Version: ${VERSION}"
echo ""

# Function to build local image
build_local_image() {
    local service=$1
    local context_dir=$2
    local dockerfile=$3
    
    echo -e "${YELLOW}📦 Building ${service} locally...${NC}"
    
    docker build \
        --tag ${service}:${VERSION} \
        --tag ${service}:latest \
        --file ${dockerfile} \
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
build_local_image "pokedex-backend" "./back-end" "./back-end/Dockerfile"

# Build frontend
echo -e "${BLUE}Building Frontend...${NC}"
build_local_image "modern-pokedex" "./modern-pokedex" "./modern-pokedex/Dockerfile"

echo -e "${GREEN}🎉 All local images built successfully!${NC}"
echo -e "${GREEN}=======================================${NC}"
echo -e "Images available:"
echo -e "- pokedex-backend:${VERSION}"
echo -e "- modern-pokedex:${VERSION}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Start with docker-compose:"
echo -e "   docker-compose up -d"
echo -e "2. Or run individual containers:"
echo -e "   docker run -p 8080:8080 pokedex-backend:latest"
echo -e "   docker run -p 3000:80 modern-pokedex:latest"
