# Pokemon API Makefile

.PHONY: help build run test clean import-data test-connection

help: ## Show this help message
	@echo "Pokemon API Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build the API server
	@echo "Building Pokemon API..."
	go build -o bin/pokemon-api main.go

run: ## Run the API server
	@echo "Starting Pokemon API server..."
	go run main.go

test: ## Run tests
	@echo "Running tests..."
	go test ./...

clean: ## Clean build artifacts
	@echo "Cleaning..."
	rm -rf bin/
	rm -f api.log api.pid

import-data: ## Import Pokemon data to MongoDB
	@echo "Importing Pokemon data..."
	go run jsonImport/jsonImport.go

docker-build: ## Build Docker image
	@echo "Building Docker image..."
	docker build -t pokedex-backend .

docker-run: ## Run Docker container
	@echo "Running Docker container..."
	docker run -p 8080:8080 pokedex-backend

docker-all: docker-build docker-run ## Build and run Docker container

docker-compose-up: ## Start services with docker-compose
	@echo "Starting services with docker-compose..."
	docker-compose up -d

docker-compose-down: ## Stop services with docker-compose
	@echo "Stopping services with docker-compose..."
	docker-compose down

docker-logs: ## View Docker container logs
	@echo "Viewing container logs..."
	docker-compose logs -f pokemon-api

run-all: ## Import data and run API server
	@echo "Importing data and starting server..."
	go run jsonImport/jsonImport.go && go run main.go

test-connection: ## Test MongoDB connection
	@echo "Testing MongoDB connection..."
	go run test_connection.go

dev: ## Run in development mode with auto-reload
	@echo "Starting development server..."
	@which air > /dev/null || (echo "Installing air..." && go install github.com/cosmtrek/air@latest)
	air

install-deps: ## Install Go dependencies
	@echo "Installing dependencies..."
	go mod tidy
	go mod download



logs: ## Show API logs
	@echo "Showing API logs..."
	tail -f api.log

stop: ## Stop running API server
	@echo "Stopping API server..."
	@if [ -f api.pid ]; then \
		kill $$(cat api.pid) && rm api.pid; \
		echo "API server stopped"; \
	else \
		echo "No API server running"; \
	fi