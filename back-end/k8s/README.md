# Pokedex Backend Kubernetes Deployment

## Files Overview

- `configmap.yaml` - Configuration สำหรับ MongoDB connection
- `deployment.yaml` - Deployment และ Service สำหรับ backend
- `ingress.yaml` - Ingress สำหรับ external access
- `kustomization.yaml` - Kustomize configuration

## Prerequisites

1. Kubernetes cluster ที่พร้อมใช้งาน
2. Docker image `pokedex-backend:1.0.0` ที่ build แล้ว
3. NGINX Ingress Controller (สำหรับ ingress)

## Deployment Commands

### Deploy ทั้งหมดด้วย kubectl:
```bash
kubectl apply -f .
```

### หรือใช้ kustomize:
```bash
kubectl apply -k .
```

### ตรวจสอบ deployment:
```bash
kubectl get pods -l app=pokedex-backend
kubectl get svc pokedex-backend-service
kubectl get ingress pokedex-backend-ingress
```

### ดู logs:
```bash
kubectl logs -l app=pokedex-backend -f
```

## Access the API

### ผ่าน Service (internal):
```bash
kubectl port-forward svc/pokedex-backend-service 8080:8080
```
แล้วเข้าถึงที่ `http://localhost:8080/api/pokemon`

### ผ่าน Ingress (external):
เพิ่ม entry ใน `/etc/hosts`:
```
<INGRESS_IP> pokedex-api.local
```
แล้วเข้าถึงที่ `http://pokedex-api.local/api/pokemon`

## Configuration

หากต้องการแก้ไข MongoDB configuration ให้แก้ไขใน `configmap.yaml` แล้ว apply ใหม่:
```bash
kubectl apply -f configmap.yaml
kubectl rollout restart deployment/pokedex-backend
```

## Scaling

เพิ่มจำนวน replicas:
```bash
kubectl scale deployment pokedex-backend --replicas=3
```

## Cleanup

ลบ deployment ทั้งหมด:
```bash
kubectl delete -f .
```