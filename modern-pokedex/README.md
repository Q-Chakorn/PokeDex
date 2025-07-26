# Modern Pokédex 🔥

A modern, responsive Pokédex application built with React, TypeScript, and Tailwind CSS. Explore the world of Pokémon with a beautiful, performant, and accessible interface.

![Modern Pokédex](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-blue) ![Test Coverage](https://img.shields.io/badge/Coverage-85%25-green)

## ✨ Features

### Core Functionality
- 🔍 **Advanced Search**: Search Pokémon by name or Pokédex number
- 🏷️ **Type Filtering**: Filter by single or multiple Pokémon types
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile
- ⚡ **Performance Optimized**: Lazy loading, code splitting, and virtual scrolling
- 🌐 **Internationalization**: Full support for English and Thai languages

### User Experience
- 🌙 **Dark/Light Theme**: Seamless theme switching with system preference detection
- ♿ **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations
- 📊 **Detailed Stats**: Comprehensive Pokémon information and stat visualization
- 🚀 **Fast Loading**: Optimized images and efficient data loading

### Technical Features
- 🔧 **TypeScript**: Full type safety and excellent developer experience
- 🧪 **Comprehensive Testing**: Unit, integration, E2E, and accessibility tests
- 🐳 **Docker Ready**: Production-ready containerization
- 📈 **Performance Monitoring**: Built-in performance tracking and optimization
- 🔄 **State Management**: Efficient state management with React Context

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 8.0 or higher (or **yarn** 1.22+)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/modern-pokedex.git
cd modern-pokedex
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

### Development
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Code Quality
```bash
npm run lint         # Run ESLint for code quality
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Format code with Prettier
```

### Testing
```bash
npm run test         # Run unit tests in watch mode
npm run test:run     # Run unit tests once
npm run test:coverage # Run tests with coverage report
npm run test:e2e     # Run end-to-end tests
npm run test:e2e:ui  # Run E2E tests with UI
```

### Performance & Analysis
```bash
npm run analyze      # Analyze bundle size
npm run perf:build   # Build with performance analysis
```

### Docker
```bash
npm run docker:build # Build Docker image
npm run docker:dev   # Run development container
```

## 🐳 Docker Deployment

### Development Environment
```bash
# Using Docker Compose
docker-compose up -d

# Or using npm script
npm run docker:dev
```

### Production Deployment
```bash
# Build production image
docker build -t modern-pokedex .

# Run production container
docker run -p 80:80 modern-pokedex
```

## 🏗️ Project Structure

```
modern-pokedex/
├── 📁 public/                 # Static assets
├── 📁 src/
│   ├── 📁 components/         # Reusable UI components
│   │   ├── 📁 layout/         # Layout components (Header, Footer)
│   │   ├── 📁 ui/             # Basic UI components (Button, Badge)
│   │   ├── 📁 pokemon/        # Pokémon-specific components
│   │   └── 📁 filters/        # Search and filter components
│   ├── 📁 pages/              # Page components
│   ├── 📁 contexts/           # React contexts for state management
│   ├── 📁 hooks/              # Custom React hooks
│   ├── 📁 services/           # API and data services
│   ├── 📁 utils/              # Utility functions
│   ├── 📁 types/              # TypeScript type definitions
│   ├── 📁 assets/             # Images, icons, and other assets
│   ├── 📁 i18n/               # Internationalization files
│   └── 📁 test/               # Test utilities and setup
├── 📁 e2e/                    # End-to-end tests
├── 📁 docs/                   # Documentation
├── 📁 scripts/                # Build and utility scripts
└── 📄 Configuration files
```

## 🧪 Testing Strategy

### Test Coverage
- **Unit Tests**: 85%+ coverage for components and utilities
- **Integration Tests**: Complete user workflow testing
- **E2E Tests**: Cross-browser testing with Playwright
- **Accessibility Tests**: WCAG compliance validation
- **Performance Tests**: Core Web Vitals monitoring

### Running Tests
```bash
# Unit tests
npm run test:coverage

# E2E tests
npm run test:e2e

# All tests (CI pipeline)
./scripts/test-ci.sh
```

## 🌐 Internationalization

The application supports multiple languages:

- **English** (default)
- **Thai** (ไทย)

## 🎨 Theming

### Theme System
- **Light Theme**: Clean, bright interface
- **Dark Theme**: Easy on the eyes for low-light usage
- **System Theme**: Automatically matches OS preference
- **Persistent**: Theme preference saved to localStorage

## ⚡ Performance Optimizations

### Implemented Optimizations
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format with fallbacks
- **Virtual Scrolling**: Efficient rendering of large lists
- **Memoization**: React.memo for expensive components
- **Bundle Analysis**: Webpack Bundle Analyzer integration

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Getting Started
1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch
4. **Make** your changes
5. **Test** your changes
6. **Submit** a pull request

## 📚 Documentation

- **[Testing Guide](docs/TESTING.md)**: Comprehensive testing documentation
- **[Docker Guide](docs/DOCKER.md)**: Container deployment guide
- **[Test Summary](docs/TEST_SUMMARY.md)**: Test coverage summary

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Test Failures**
```bash
# Update test snapshots
npm run test -- --update-snapshots
```

**Docker Issues**
```bash
# Rebuild Docker image
docker build --no-cache -t modern-pokedex .
```

## 📊 Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 90+     |
| Firefox | 88+     |
| Safari  | 14+     |
| Edge    | 90+     |

## 📄 License

This project is licensed under the **MIT License**.

## 🙏 Acknowledgments

- **PokéAPI** for providing comprehensive Pokémon data
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the lightning-fast build tool

---

<div align="center">
  <p>Made with ❤️ by developers who love Pokémon</p>
</div>