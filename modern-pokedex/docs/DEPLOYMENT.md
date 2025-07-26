# Deployment Guide

## Overview

This guide covers various deployment options for the Modern Pokédex application, from local development to production environments.

## Prerequisites

- Node.js 18.0 or higher
- npm 8.0 or higher
- Docker (for containerized deployment)
- Git

## Build Process

### Production Build

```bash
# Install dependencies
npm ci

# Run tests
npm run test:run

# Build for production
npm run build

# Preview build locally
npm run preview
```

The build process creates optimized static files in the `dist/` directory.

## Deployment Options

### 1. Static Hosting (Recommended)

#### Netlify

1. **Connect Repository**
   - Link your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Environment Variables**
   ```
   NODE_ENV=production
   VITE_APP_TITLE=Modern Pokédex
   ```

3. **Deploy Settings**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

#### Vercel

1. **Deploy Command**
   ```bash
   npx vercel --prod
   ```

2. **Configuration**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite"
   }
   ```

#### GitHub Pages

1. **GitHub Actions Workflow**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: '20'
             cache: 'npm'
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

### 2. Docker Deployment

#### Production Container

```bash
# Build Docker image
docker build -t modern-pokedex .

# Run container
docker run -d -p 80:80 --name pokedex modern-pokedex

# Or use docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

#### Docker Compose (Production)

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  pokedex:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 3. Cloud Platforms

#### AWS S3 + CloudFront

1. **Build and Upload**
   ```bash
   npm run build
   aws s3 sync dist/ s3://your-bucket-name --delete
   aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
   ```

2. **S3 Bucket Configuration**
   - Enable static website hosting
   - Set index document: `index.html`
   - Set error document: `index.html`

3. **CloudFront Distribution**
   - Origin: S3 bucket
   - Default root object: `index.html`
   - Error pages: 404 → `/index.html` (200)

#### Google Cloud Platform

```bash
# Build application
npm run build

# Deploy to App Engine
gcloud app deploy

# Or deploy to Cloud Storage + CDN
gsutil -m rsync -r -d dist/ gs://your-bucket-name
```

#### Azure Static Web Apps

```yaml
# .github/workflows/azure-static-web-apps.yml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches: [ main ]

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: "dist"
```

## Environment Configuration

### Environment Variables

```bash
# .env.production
NODE_ENV=production
VITE_APP_TITLE=Modern Pokédex
VITE_API_BASE_URL=https://pokeapi.co/api/v2
VITE_ENABLE_ANALYTICS=true
VITE_SENTRY_DSN=your-sentry-dsn
```

### Build Optimization

```bash
# Analyze bundle size
npm run analyze

# Build with performance profiling
npm run perf:build

# Generate build report
npm run build -- --report
```

## Performance Optimization

### Pre-deployment Checklist

- [ ] Run performance audit: `npm run lighthouse`
- [ ] Check bundle size: `npm run analyze`
- [ ] Verify test coverage: `npm run test:coverage`
- [ ] Run E2E tests: `npm run test:e2e`
- [ ] Check accessibility: `npm run test:a11y`

### CDN Configuration

```nginx
# nginx.conf for CDN
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
    gzip_static on;
}

location / {
    try_files $uri $uri/ /index.html;
    add_header Cache-Control "no-cache";
}
```

## Monitoring and Analytics

### Error Tracking

```typescript
// Sentry configuration
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Performance Monitoring

```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    event_category: 'Web Vitals',
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## Security Considerations

### Content Security Policy

```html
<!-- CSP Header -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               font-src 'self' data:;">
```

### HTTPS Configuration

```nginx
# Force HTTPS redirect
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

## Rollback Strategy

### Version Management

```bash
# Tag releases
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Rollback to previous version
git checkout v1.0.0
npm run build
# Deploy previous version
```

### Blue-Green Deployment

```yaml
# docker-compose.blue-green.yml
version: '3.8'

services:
  pokedex-blue:
    build: .
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
      - VERSION=blue

  pokedex-green:
    build: .
    ports:
      - "8081:80"
    environment:
      - NODE_ENV=production
      - VERSION=green

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
    depends_on:
      - pokedex-blue
      - pokedex-green
```

## Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm ci
npm run build
```

**Memory Issues**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

**Docker Issues**
```bash
# Check container logs
docker logs modern-pokedex

# Debug container
docker exec -it modern-pokedex sh
```

### Health Checks

```bash
# Application health check
curl -f http://localhost/health || exit 1

# Performance check
lighthouse --chrome-flags="--headless" http://localhost
```

## Maintenance

### Regular Tasks

- [ ] Update dependencies monthly
- [ ] Review security vulnerabilities
- [ ] Monitor performance metrics
- [ ] Update SSL certificates
- [ ] Backup deployment configurations

### Automated Maintenance

```yaml
# .github/workflows/maintenance.yml
name: Maintenance

on:
  schedule:
    - cron: '0 2 * * 1' # Weekly on Monday at 2 AM

jobs:
  update-dependencies:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit fix
      - run: npm update
      - run: npm test
      # Create PR with updates
```

## Support

For deployment issues:
- Check the [troubleshooting section](#troubleshooting)
- Review application logs
- Contact the development team
- Create an issue in the repository

---

**Last Updated**: January 2025  
**Version**: 1.0.0