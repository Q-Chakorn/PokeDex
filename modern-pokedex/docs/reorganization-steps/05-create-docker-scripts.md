# Step 5: Create Docker Scripts

## Overview
Create Docker management scripts for development and production builds.

## Commands to Run

### 1. Create Docker Build Script
Create the file `scripts/docker/docker-build.sh`:

```bash
cat > scripts/docker/docker-build.sh << 'EOF'
#!/bin/bash

# Modern Pokédx - Production Docker Build Script
set -e

echo "🐳 Building Modern Pokédx production Docker image..."

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
EOF
```

### 2. Create Docker Development Script
Create the file `scripts/docker/docker-dev.sh`:

```bash
cat > scripts/docker/docker-dev.sh << 'EOF'
#!/bin/bash

# Modern Pokédx - Development Docker Script
set -e

echo "🐳 Starting Modern Pokédx development environment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
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

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Default values
COMPOSE_FILE="config/docker/docker-compose.yml"
SERVICE_NAME="app"
PORT="3000"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -f|--file)
            COMPOSE_FILE="$2"
            shift 2
            ;;
        -s|--service)
            SERVICE_NAME="$2"
            shift 2
            ;;
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        --build)
            BUILD_FLAG="--build"
            shift
            ;;
        --down)
            docker-compose -f "$COMPOSE_FILE" down
            print_status "Development environment stopped"
            exit 0
            ;;
        --logs)
            docker-compose -f "$COMPOSE_FILE" logs -f "$SERVICE_NAME"
            exit 0
            ;;
        --shell)
            docker-compose -f "$COMPOSE_FILE" exec "$SERVICE_NAME" /bin/sh
            exit 0
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -f, --file FILE      Docker Compose file (default: config/docker/docker-compose.yml)"
            echo "  -s, --service NAME   Service name (default: app)"
            echo "  -p, --port PORT      Port to expose (default: 3000)"
            echo "  --build              Force rebuild of images"
            echo "  --down               Stop and remove containers"
            echo "  --logs               Show and follow logs"
            echo "  --shell              Open shell in container"
            echo "  -h, --help           Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not in PATH"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed or not in PATH"
    exit 1
fi

# Check if compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    print_error "Docker Compose file not found: $COMPOSE_FILE"
    exit 1
fi

print_status "Using Docker Compose file: $COMPOSE_FILE"
print_status "Starting service: $SERVICE_NAME"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        print_warning ".env file not found, creating from .env.example"
        cp .env.example .env
    else
        print_warning ".env file not found, creating basic configuration"
        cat > .env << EOF
VITE_APP_TITLE=Modern Pokédx
VITE_API_BASE_URL=https://pokeapi.co/api/v2
VITE_ENABLE_ANALYTICS=false
NODE_ENV=development
PORT=$PORT
EOF
    fi
fi

# Start the development environment
print_status "Starting development containers..."
if docker-compose -f "$COMPOSE_FILE" up -d $BUILD_FLAG; then
    print_status "Development environment started successfully!"
else
    print_error "Failed to start development environment"
    exit 1
fi

# Wait for the service to be ready
print_info "Waiting for service to be ready..."
sleep 5

# Check if the service is running
if docker-compose -f "$COMPOSE_FILE" ps "$SERVICE_NAME" | grep -q "Up"; then
    print_status "Service is running!"
    
    echo ""
    echo "🌐 Development server is available at:"
    echo "   http://localhost:$PORT"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs:    $0 --logs"
    echo "   Open shell:   $0 --shell"
    echo "   Stop:         $0 --down"
    echo "   Rebuild:      $0 --build"
    echo ""
    echo "📊 Container status:"
    docker-compose -f "$COMPOSE_FILE" ps
    
else
    print_error "Service failed to start properly"
    echo ""
    echo "📋 Container logs:"
    docker-compose -f "$COMPOSE_FILE" logs "$SERVICE_NAME"
    exit 1
fi

print_status "Development environment is ready! 🎉"
EOF
```

### 3. Make Scripts Executable
```bash
chmod +x scripts/docker/docker-build.sh
chmod +x scripts/docker/docker-dev.sh
```

## Expected Result
Docker scripts should be created and executable:

```
scripts/
└── docker/
    ├── docker-build.sh
    └── docker-dev.sh
```

## Verification
Check that scripts were created and are executable:
```bash
ls -la scripts/docker/
file scripts/docker/docker-build.sh
file scripts/docker/docker-dev.sh
```

## Next Step
Proceed to [Step 6: Create Development Scripts](06-create-dev-scripts.md)