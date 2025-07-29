# Multi-stage build for Go application
FROM --platform=$BUILDPLATFORM golang:1.23.4-alpine AS builder

# Set build arguments for cross-compilation
ARG TARGETPLATFORM
ARG BUILDPLATFORM
ARG TARGETOS
ARG TARGETARCH

# Install git and ca-certificates (needed for some Go modules)
RUN apk add --no-cache git ca-certificates

# Set working directory
WORKDIR /app

# Copy go mod files first for better caching
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the applications with cross-compilation support
RUN CGO_ENABLED=0 GOOS=${TARGETOS:-linux} GOARCH=${TARGETARCH:-amd64} \
    go build -a -installsuffix cgo -ldflags="-w -s" -o main main.go
RUN CGO_ENABLED=0 GOOS=${TARGETOS:-linux} GOARCH=${TARGETARCH:-amd64} \
    go build -a -installsuffix cgo -ldflags="-w -s" -o jsonImportBin jsonImport/jsonImport.go

# Final stage - use scratch for minimal image
FROM alpine:latest

# Install ca-certificates and bash for better shell support
RUN apk --no-cache add ca-certificates bash

# Create app directory
WORKDIR /app

# Copy built binaries from builder stage
COPY --from=builder /app/main .
COPY --from=builder /app/jsonImportBin .

# Copy configuration and data files
COPY --from=builder /app/env.yaml .
COPY --from=builder /app/jsonImport ./jsonImport

# Create startup script with better error handling
RUN cat > start.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Starting Pokemon API Backend..."
echo "=================================="

# Run JSON import first
echo "📥 Importing Pokemon data..."
if ./jsonImportBin; then
    echo "✅ Data import completed successfully!"
else
    echo "❌ Data import failed!"
    exit 1
fi

echo ""
echo "🌟 Starting main API server..."
echo "Server will be available at http://localhost:8080"
echo "=================================="

# Start the main application
exec ./main
EOF

# Make startup script executable
RUN chmod +x start.sh

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/pokemon || exit 1

# Run the startup script
CMD ["./start.sh"]