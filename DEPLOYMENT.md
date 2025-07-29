# PokeDex Deployment Guide

## 🚀 Quick Start

### สำหรับ Local Development

```bash
# 1. Build local images
./build-local.sh

# 2. Option A: Run with Docker Compose
docker-compose up -d

# 2. Option B: Deploy to local Kubernetes
./deploy-k8s.sh local
```

### สำหรับ Server Deployment (27.254.134.143)

```bash
# 1. Build and push images to registry
./build-images.sh

# 2. Option A: Run with Docker Compose (on server)
docker-compose -f docker-compose.prod.yml up -d

# 2. Option B: Deploy to Kubernetes
./deploy-k8s.sh server
```

## 📦 Available Images

### Backend
- **Local**: `pokedex-backend:latest`
- **Registry**: `chakorn/pokedex-backend:1.0.6`

### Frontend
- **Local**: `modern-pokedex:latest`
- **Registry**: `chakorn/modern-pokedex:1.0.6`

## 🔧 Configuration

### Environment Variables

#### Backend
- `GO_ENV`: `development` | `production`

#### Frontend
- `VITE_API_BASE_URL`: API endpoint URL
- `VITE_APP_TITLE`: Application title
- `VITE_APP_VERSION`: Application version
- `NODE_ENV`: `development` | `production`

### Service Ports

#### Local Development
- **Frontend**: http://localhost:3000 (Docker Compose) | http://localhost:30000 (K8s)
- **Backend**: http://localhost:8080 (Docker Compose) | http://localhost:30001 (K8s)

#### Server Deployment
- **Frontend**: http://27.254.134.143:30000
- **Backend**: http://27.254.134.143:30001

## 🐳 Docker Commands

### Build Images
```bash
# Local development
./build-local.sh

# Production images
./build-images.sh
```

### Run with Docker Compose
```bash
# Local development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d

# Stop services
docker-compose down
```

### Manual Docker Run
```bash
# Backend
docker run -p 8080:8080 pokedex-backend:latest

# Frontend (local)
docker run -p 3000:80 -e VITE_API_BASE_URL=http://localhost:8080/api modern-pokedex:latest

# Frontend (server)
docker run -p 80:80 -e VITE_API_BASE_URL=http://27.254.134.143:8080/api modern-pokedex:latest
```

## ☸️ Kubernetes Commands

### Deploy
```bash
# Local development
./deploy-k8s.sh local

# Server deployment
./deploy-k8s.sh server

# Both configurations
./deploy-k8s.sh both
```

### Manual Kubernetes Commands
```bash
# Apply deployments
kubectl apply -f k8s/deploy-pokedex-local.yaml      # Local
kubectl apply -f k8s/deploy-pokedex-complete.yaml   # Server

# Check status
kubectl get pods -n pokedex-local    # Local
kubectl get pods -n pokedex          # Server

# Check services
kubectl get services -n pokedex-local
kubectl get services -n pokedex

# View logs
kubectl logs -f deployment/pokedex-backend-local -n pokedex-local
kubectl logs -f deployment/modern-pokedex-local -n pokedex-local

# Delete deployments
kubectl delete namespace pokedex-local   # Local
kubectl delete namespace pokedex         # Server
```

## 🔍 Troubleshooting

### Check Application Health
```bash
# Backend health check
curl http://localhost:8080/api/pokemon/stats          # Local
curl http://27.254.134.143:30001/api/pokemon/stats    # Server

# Frontend access
curl http://localhost:3000/                           # Local Docker
curl http://localhost:30000/                          # Local K8s
curl http://27.254.134.143:30000/                     # Server
```

### View Container Logs
```bash
# Docker Compose
docker-compose logs backend
docker-compose logs frontend

# Docker containers
docker logs pokedex-backend
docker logs modern-pokedex

# Kubernetes
kubectl logs -f deployment/pokedex-backend -n pokedex
kubectl logs -f deployment/modern-pokedex -n pokedex
```

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 8080, 30000, 30001 are available
2. **Image pull issues**: Ensure images are built and available in registry
3. **Network connectivity**: Check if backend is accessible from frontend
4. **Resource limits**: Ensure sufficient CPU/memory for containers

## 📋 Deployment Checklist

### Pre-deployment
- [ ] Docker installed and running
- [ ] kubectl configured (for K8s deployment)
- [ ] Required ports available
- [ ] Images built and available

### Local Development
- [ ] Run `./build-local.sh`
- [ ] Choose deployment method (Docker Compose or K8s)
- [ ] Verify services at localhost:3000 and localhost:8080

### Server Deployment
- [ ] Run `./build-images.sh` to push images
- [ ] Update server IP if different from 27.254.134.143
- [ ] Deploy using chosen method
- [ ] Verify services at server:30000 and server:30001

### Post-deployment
- [ ] Test frontend functionality
- [ ] Test API endpoints
- [ ] Monitor application logs
- [ ] Set up monitoring/alerting if needed
