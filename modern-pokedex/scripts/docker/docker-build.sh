#!/bin/bash

# Modern Pokédex - Production Docker Build Script
set -e

echo "🐳 Building Modern Pokédex production Docker image..."

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

# Default values
IMAGE_NAME="modern-pokedex"
TAG="latest"
BUILD_CONTEXT="."
DOCKERFILE="config/docker/Dockerfile"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--tag)
            TAG="$2"
            shift 2
            ;;
        -n|--name)
            IMAGE_NAME="$2"
            shift 2
            ;;
        -f|--file)
            DOCKERFILE="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -t, --tag TAG        Docker image tag (default: latest)"
            echo "  -n, --name NAME      Docker image name (default: modern-pokedex)"
            echo "  -f, --file FILE      Dockerfile path (default: config/docker/Dockerfile)"
            echo "  -h, --help           Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not in PATH"
    exit 1
fi

# Check if Dockerfile exists
if [ ! -f "$DOCKERFILE" ]; then
    print_error "Dockerfile not found: $DOCKERFILE"
    exit 1
fi

print_status "Using Dockerfile: $DOCKERFILE"
print_status "Building image: $IMAGE_NAME:$TAG"

# Build the Docker image
print_status "Starting Docker build..."
if docker build -t "$IMAGE_NAME:$TAG" -f "$DOCKERFILE" "$BUILD_CONTEXT"; then
    print_status "Docker image built successfully!"
else
    print_error "Docker build failed"
    exit 1
fi

# Get image size
IMAGE_SIZE=$(docker images "$IMAGE_NAME:$TAG" --format "table {{.Size}}" | tail -n 1)
print_status "Image size: $IMAGE_SIZE"

# Show image details
echo ""
echo "📋 Image Details:"
docker images "$IMAGE_NAME:$TAG" --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.CreatedAt}}\t{{.Size}}"

echo ""
echo "🚀 Next steps:"
echo "1. Test the image: docker run --rm -p 3000:80 $IMAGE_NAME:$TAG"
echo "2. Push to registry: docker push $IMAGE_NAME:$TAG"
echo "3. Deploy to production"

print_status "Build completed successfully! 🎉"