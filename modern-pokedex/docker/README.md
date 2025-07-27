# Docker Configuration for Modern Pokedex

## Files Overview

- `Dockerfile` - Multi-stage build configuration for React app
- `nginx.conf` - Nginx configuration for serving the built app
- `docker-compose.yml` - Docker Compose configuration for easy deployment
- `.dockerignore` - Files to exclude from Docker build context

## Build and Run

### Using Docker directly
```bash
# From the docker directory (build context is parent directory)
cd modern-pokedex/docker

# Build the image
docker build -t modern-pokedex:1.0.0 -f Dockerfile ..

# Run the container
docker run -p 3000:80 modern-pokedex:1.0.0
```

### Using Docker Compose
```bash
# First build the image
cd modern-pokedex/docker
docker build -t modern-pokedex:1.0.0 -f Dockerfile ..

# Then run with docker-compose
docker-compose up

# Run in background
docker-compose up -d
```

## Access
- Application: http://localhost:3000

## Features
- Multi-stage build for optimized image size
- Nginx with gzip compression
- Client-side routing support
- Security headers
- Static asset caching