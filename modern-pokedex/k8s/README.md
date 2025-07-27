# Kubernetes Deployment for Modern Pokedex

## Prerequisites
- Kubernetes cluster running
- kubectl configured
- Docker image built and available

## Build Docker Image
```bash
# Build the image from the modern-pokedex directory
docker build -t modern-pokedex:latest .
```

## Deploy to Kubernetes

### Option 1: Deploy individual files
```bash
# Apply all manifests
kubectl apply -f k8s/

# Or apply individually
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

### Option 2: Deploy with Kustomize
```bash
# Deploy using kustomize
kubectl apply -k k8s/
```

## Verify Deployment
```bash
# Check pods
kubectl get pods -l app=modern-pokedex

# Check service
kubectl get svc modern-pokedex-service

# Check ingress
kubectl get ingress modern-pokedex-ingress

# View logs
kubectl logs -l app=modern-pokedex
```

## Access the Application

### Local Development (with port-forward)
```bash
kubectl port-forward svc/modern-pokedex-service 8080:80
```
Then access: http://localhost:8080

### With Ingress (production)
Add to your `/etc/hosts`:
```
<INGRESS_IP> pokedex.local
```
Then access: http://pokedex.local

## Scaling
```bash
# Scale replicas
kubectl scale deployment modern-pokedex --replicas=5
```

## Clean Up
```bash
# Delete all resources
kubectl delete -k k8s/
# or
kubectl delete -f k8s/
```

## Configuration
- Modify `configmap.yaml` for environment variables
- Update `ingress.yaml` for custom domain
- Adjust resource limits in `deployment.yaml` as needed