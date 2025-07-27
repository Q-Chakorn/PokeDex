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

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]