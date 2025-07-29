# Multi-stage build for modern-pokedex React app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files from parent directory
COPY package.json package-lock.json* ./

# Clear npm cache and install dependencies
RUN npm cache clean --force && \
    npm install

# Copy source code from parent directory
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY /docker/nginx.conf /etc/nginx/nginx.conf

# Create entrypoint script for runtime env substitution
RUN cat > /docker-entrypoint.sh << 'EOF'
#!/bin/sh
set -e

# Smart detection of environment
detect_host() {
    # If VITE_API_BASE_URL is already set, use it
    if [ -n "$VITE_API_BASE_URL" ]; then
        echo "$VITE_API_BASE_URL"
        return
    fi
    
    # If SERVER_HOST is provided, use it
    if [ -n "$SERVER_HOST" ]; then
        echo "http://${SERVER_HOST}:${BACKEND_PORT:-30001}/api"
        return
    fi
    
    # Try to detect if we're in Kubernetes by checking service account
    if [ -f /var/run/secrets/kubernetes.io/serviceaccount/token ]; then
        # We're in Kubernetes, try to use the backend service
        echo "http://pokedex-backend-service:80/api"
        return
    fi
    
    # Default to localhost
    echo "http://localhost:30001/api"
}

# Auto-detect the API URL
export VITE_API_BASE_URL=$(detect_host)
export VITE_APP_TITLE="${VITE_APP_TITLE:-Modern Pokédx}"
export VITE_APP_VERSION="${VITE_APP_VERSION:-1.0.0}"

echo "🚀 Starting Modern Pokédx Frontend..."
echo "API Base URL: $VITE_API_BASE_URL"
echo "App Title: $VITE_APP_TITLE"
echo "App Version: $VITE_APP_VERSION"

# Create runtime config injection script
cat > /usr/share/nginx/html/runtime-config.js << JSEOF
window.RUNTIME_CONFIG = {
  API_BASE_URL: '$VITE_API_BASE_URL'
};
JSEOF

# Update index.html to include runtime config
sed -i 's|<script type="module"|<script src="/runtime-config.js"></script><script type="module"|' /usr/share/nginx/html/index.html

# Start nginx
exec nginx -g "daemon off;"
EOF

RUN chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Use custom entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
