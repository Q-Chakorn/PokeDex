# Docker Setup Guide

This guide explains how to run the Modern Pokédex application using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

## Quick Start

### Development Environment

1. **Clone the repository and navigate to the project directory:**
   ```bash
   git clone <repository-url>
   cd modern-pokedex
   ```

2. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Start the development environment:**
   ```bash
   ./scripts/docker-dev.sh up
   ```

4. **Access the application:**
   - Application: http://localhost:3000
   - Hot reload is enabled for development

### Production Environment

1. **Build and run production container:**
   ```bash
   ./scripts/docker-build.sh --name modern-pokedex --tag latest
   docker run -p 80:80 modern-pokedex:latest
   ```

2. **Or use Docker Compose with production profile:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up app-prod
   ```

3. **Access the application:**
   - Application: http://localhost:8080

## Docker Scripts

### Development Script (`./scripts/docker-dev.sh`)

```bash
# Start development environment
./scripts/docker-dev.sh up

# Start with rebuild
./scripts/docker-dev.sh up --build

# Start in detached mode
./scripts/docker-dev.sh up --detach

# View logs
./scripts/docker-dev.sh logs

# View logs for specific service
./scripts/docker-dev.sh logs app

# Open shell in app container
./scripts/docker-dev.sh shell

# Stop environment
./scripts/docker-dev.sh down

# Restart services
./scripts/docker-dev.sh restart

# Clean up everything
./scripts/docker-dev.sh clean

# Show container status
./scripts/docker-dev.sh status
```

### Build Script (`./scripts/docker-build.sh`)

```bash
# Basic build
./scripts/docker-build.sh

# Build with custom name and tag
./scripts/docker-build.sh --name myapp --tag v1.0.0

# Build and push to registry
./scripts/docker-build.sh --registry ghcr.io/username --push

# Build with custom build arguments
./scripts/docker-build.sh --build-arg NODE_ENV=production
```

## Docker Compose Profiles

The application uses Docker Compose profiles to organize different services:

### Default Profile (Development)
- `app`: Main application container with hot reload

### Production Profile
- `app-prod`: Production-optimized container

### Optional Profiles
- `nginx`: Reverse proxy with SSL support
- `cache`: Redis for caching
- `database`: PostgreSQL database
- `monitoring`: Prometheus and Grafana

### Using Profiles

```bash
# Start with specific profiles
docker-compose --profile cache --profile database up

# Start production with monitoring
docker-compose --profile production --profile monitoring up
```

## Environment Variables

Copy `.env.example` to `.env` and customize:

```bash
# Application
NODE_ENV=development
VITE_APP_TITLE=Modern Pokédex

# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_POKEMON_API_URL=https://pokeapi.co/api/v2

# Database (optional)
POSTGRES_DB=pokedex
POSTGRES_USER=pokedex
POSTGRES_PASSWORD=pokedex123

# Redis (optional)
REDIS_PASSWORD=pokedex123

# Monitoring (optional)
GRAFANA_PASSWORD=admin123
```

## Container Architecture

### Development Container (`Dockerfile.dev`)
- Based on `node:18-alpine`
- Includes development dependencies
- Enables hot reload
- Mounts source code as volume
- Exposes ports 3000 (app) and 24678 (HMR)

### Production Container (`Dockerfile`)
- Multi-stage build
- Stage 1: Build application with Node.js
- Stage 2: Serve with Nginx
- Optimized for size and security
- Includes health checks

## Networking

All services run on the `pokedex-network` bridge network:

- `app`: Main application (port 3000)
- `app-prod`: Production app (port 80)
- `nginx`: Reverse proxy (ports 80, 443)
- `redis`: Cache (port 6379)
- `postgres`: Database (port 5432)
- `prometheus`: Monitoring (port 9090)
- `grafana`: Visualization (port 3001)

## Volumes

Persistent volumes for data storage:

- `redis-data`: Redis data persistence
- `postgres-data`: PostgreSQL data
- `prometheus-data`: Prometheus metrics
- `grafana-data`: Grafana dashboards

## Health Checks

All containers include health checks:

- **App containers**: HTTP check on main port
- **Database**: Connection check
- **Redis**: Ping command
- **Nginx**: HTTP health endpoint

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check what's using the port
   lsof -i :3000
   
   # Use different ports in docker-compose.yml
   ports:
     - "3001:3000"
   ```

2. **Permission issues:**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

3. **Build failures:**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   ./scripts/docker-dev.sh build --no-cache
   ```

4. **Hot reload not working:**
   ```bash
   # Ensure CHOKIDAR_USEPOLLING is set
   echo "CHOKIDAR_USEPOLLING=true" >> .env
   ```

### Debugging

1. **View container logs:**
   ```bash
   ./scripts/docker-dev.sh logs app
   ```

2. **Access container shell:**
   ```bash
   ./scripts/docker-dev.sh shell app
   ```

3. **Inspect container:**
   ```bash
   docker inspect modern-pokedex-dev
   ```

4. **Check resource usage:**
   ```bash
   docker stats
   ```

## Performance Optimization

### Development
- Use volume mounts for fast file changes
- Enable polling for file watching
- Limit container resources if needed

### Production
- Multi-stage builds for smaller images
- Nginx for static file serving
- Gzip compression enabled
- Security headers configured
- Health checks for reliability

## Security Considerations

1. **Non-root user**: Containers run as non-root user
2. **Security headers**: Nginx configured with security headers
3. **Secrets management**: Use Docker secrets for sensitive data
4. **Network isolation**: Services communicate through internal network
5. **Image scanning**: Regularly scan images for vulnerabilities

## Monitoring and Logging

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app

# Export logs
docker-compose logs --no-color > app.log
```

### Monitoring (with monitoring profile)
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin123)

### Metrics
- Container metrics via cAdvisor
- Application metrics (if implemented)
- Nginx access logs
- Database performance metrics

## Deployment

### Local Production Test
```bash
# Build production image
./scripts/docker-build.sh --tag prod

# Run production container
docker run -p 80:80 modern-pokedex:prod
```

### Registry Deployment
```bash
# Build and push to registry
./scripts/docker-build.sh --registry your-registry.com --push

# Deploy on target server
docker pull your-registry.com/modern-pokedex:latest
docker run -d -p 80:80 your-registry.com/modern-pokedex:latest
```

### Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml -c docker-compose.prod.yml pokedex
```

### Kubernetes
See `k8s/` directory for Kubernetes manifests (if available).

## Maintenance

### Regular Tasks
```bash
# Update base images
docker-compose pull

# Clean up unused resources
docker system prune

# Backup volumes
docker run --rm -v modern-pokedex-postgres-data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz /data

# Update dependencies
./scripts/docker-dev.sh shell
npm update
```

### Monitoring Disk Usage
```bash
# Check Docker disk usage
docker system df

# Clean up old images
docker image prune -a
```

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review Docker and Docker Compose logs
3. Check the project's issue tracker
4. Consult Docker documentation