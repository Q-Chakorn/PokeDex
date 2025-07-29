# PokeDex Makefile
.PHONY: help build-local build-prod deploy-local deploy-server clean test

# Default target
help:
	@echo "🚀 PokeDex Development Commands"
	@echo "==============================="
	@echo ""
	@echo "🏠 Local Development:"
	@echo "  make build-local    - Build local Docker images"
	@echo "  make run-local      - Run with Docker Compose"
	@echo "  make deploy-local   - Deploy to local Kubernetes"
	@echo ""
	@echo "🌐 Production:"
	@echo "  make build-prod     - Build and push production images"
	@echo "  make deploy-server  - Deploy to server Kubernetes"
	@echo "  make run-prod       - Run production Docker Compose"
	@echo ""
	@echo "🧹 Cleanup:"
	@echo "  make clean-docker   - Clean Docker resources"
	@echo "  make clean-k8s      - Clean Kubernetes resources"
	@echo "  make clean          - Clean everything"
	@echo ""
	@echo "🔧 Development:"
	@echo "  make test           - Run tests"
	@echo "  make logs           - View Docker logs"
	@echo "  make status         - Check deployment status"

# Local Development
build-local:
	@echo "🏠 Building local images..."
	./build-local.sh

run-local:
	@echo "🏠 Starting local services with Docker Compose..."
	docker-compose up -d

deploy-local:
	@echo "🏠 Deploying to local Kubernetes..."
	./deploy-k8s.sh local

# Production
build-prod:
	@echo "🌐 Building production images..."
	./build-images.sh

deploy-server:
	@echo "🌐 Deploying to server..."
	./deploy-k8s.sh server

run-prod:
	@echo "🌐 Starting production services..."
	docker-compose -f docker-compose.prod.yml up -d

# Cleanup
clean-docker:
	@echo "🧹 Cleaning Docker resources..."
	./cleanup.sh docker

clean-k8s:
	@echo "🧹 Cleaning Kubernetes resources..."
	./cleanup.sh k8s

clean:
	@echo "🧹 Cleaning everything..."
	./cleanup.sh all

# Development helpers
test:
	@echo "🧪 Running tests..."
	cd modern-pokedex && npm test
	cd back-end && go test ./...

logs:
	@echo "📋 Viewing Docker logs..."
	docker-compose logs -f

status:
	@echo "📊 Checking deployment status..."
	@echo ""
	@echo "Docker Compose Status:"
	@docker-compose ps || echo "No Docker Compose services running"
	@echo ""
	@echo "Local Kubernetes Status:"
	@kubectl get pods -n pokedex-local 2>/dev/null || echo "No local K8s deployment found"
	@echo ""
	@echo "Server Kubernetes Status:"
	@kubectl get pods -n pokedex 2>/dev/null || echo "No server K8s deployment found"

# Development workflow shortcuts
dev: build-local run-local
	@echo "🎉 Local development environment ready!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8080"

prod: build-prod deploy-server
	@echo "🎉 Production deployment complete!"
	@echo "Frontend: http://27.254.134.143:30000"
	@echo "Backend: http://27.254.134.143:30001"

# Emergency stop
stop:
	@echo "🛑 Stopping all services..."
	docker-compose down || true
	docker-compose -f docker-compose.prod.yml down || true
	kubectl delete namespace pokedex-local --ignore-not-found=true
	kubectl delete namespace pokedex --ignore-not-found=true
