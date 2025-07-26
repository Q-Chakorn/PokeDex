# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Setup Development Environment
```bash
# Clone and navigate to project
cd modern-pokedex

# Automated setup (recommended)
npm run setup

# Or manual setup
npm ci
cp .env.example .env
npx playwright install --with-deps
```

### 2. Start Development
```bash
# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### 3. Verify Everything Works
```bash
# Run tests
npm run test:run

# Build for production
npm run build
```

## 📋 Available Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run setup        # Setup development environment
npm run clean        # Clean build artifacts
```

### Testing
```bash
npm run test         # Run unit tests (watch mode)
npm run test:run     # Run unit tests (once)
npm run test:coverage # Run tests with coverage
npm run test:e2e     # Run E2E tests
npm run test:ci      # Run complete CI pipeline
```

### Code Quality
```bash
npm run lint         # Check code quality
npm run lint:fix     # Fix linting issues
npm run format       # Format code
```

### Analysis
```bash
npm run analyze      # Analyze bundle size
npm run perf:build   # Performance build analysis
```

### Docker
```bash
npm run docker:dev   # Start development container
npm run docker:build # Build production image
```

## 🛠️ Project Structure

```
modern-pokedex/
├── config/          # Configuration files
│   ├── build/       # Build configs (Vite, Tailwind)
│   ├── lint/        # Linting configs (ESLint, Prettier)
│   ├── docker/      # Docker configs
│   └── test/        # Test configs (Playwright)
├── scripts/         # Utility scripts
│   ├── build/       # Build scripts
│   ├── docker/      # Docker scripts
│   ├── test/        # Test scripts
│   └── dev/         # Development scripts
├── src/             # Source code
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── hooks/       # Custom hooks
│   ├── utils/       # Utility functions
│   ├── services/    # API services
│   ├── contexts/    # React contexts
│   ├── types/       # TypeScript types
│   ├── assets/      # Static assets
│   └── i18n/        # Internationalization
├── e2e/             # End-to-end tests
├── docs/            # Documentation
└── public/          # Public assets
```

## 🎯 Key Features

- **Modern React**: React 19 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Testing**: Vitest for unit tests, Playwright for E2E
- **Performance**: Bundle analysis and optimization
- **Internationalization**: Multi-language support
- **Docker**: Containerized development and deployment
- **CI/CD**: Automated testing and deployment scripts

## 🔧 Development Workflow

1. **Start Development**
   ```bash
   npm run dev
   ```

2. **Make Changes**
   - Edit files in `src/`
   - Hot reload automatically updates the browser

3. **Test Your Changes**
   ```bash
   npm run test        # Unit tests
   npm run test:e2e    # E2E tests
   npm run lint        # Code quality
   ```

4. **Build for Production**
   ```bash
   npm run build
   npm run preview     # Test production build
   ```

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
PORT=3001 npm run dev
```

**Dependencies issues:**
```bash
npm run clean --all  # Clean everything
npm install          # Reinstall dependencies
```

**Build failures:**
```bash
npm run clean        # Clean build artifacts
npm run build        # Try building again
```

**Test failures:**
```bash
npx playwright install --with-deps  # Reinstall browsers
npm run test:run -- --reporter=verbose  # Verbose test output
```

### Getting Help

1. Check [REORGANIZATION_TESTING.md](docs/REORGANIZATION_TESTING.md) for detailed testing steps
2. Review [REORGANIZATION_SUMMARY.md](REORGANIZATION_SUMMARY.md) for project structure
3. Look at specific documentation in `docs/` folder

## 📚 Next Steps

- **Learn the codebase**: Explore `src/` directory
- **Read documentation**: Check `docs/` folder
- **Run tests**: Understand the test suite
- **Customize**: Modify components and styles
- **Deploy**: Use Docker or build for your platform

## 🤝 Contributing

1. Follow the established project structure
2. Use the provided scripts for development
3. Write tests for new features
4. Follow code quality standards
5. Update documentation as needed

---

**Happy coding!** 🎉

For more detailed information, see:
- [Project Summary](PROJECT_SUMMARY.md)
- [Testing Guide](docs/TESTING.md)
- [Docker Guide](docs/DOCKER.md)
- [API Documentation](docs/API.md)