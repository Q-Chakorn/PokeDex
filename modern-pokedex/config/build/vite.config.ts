import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'i18n-vendor': ['react-i18next', 'i18next'],
          
          // Feature chunks
          'pokemon-components': [
            './src/components/pokemon/PokemonCard.tsx',
            './src/components/pokemon/PokemonDetail.tsx',
            './src/components/pokemon/PokemonStats.tsx',
            './src/components/pokemon/PokemonGrid.tsx',
          ],
          'filter-components': [
            './src/components/filters/FilterBar.tsx',
            './src/components/filters/FilterPanel.tsx',
            './src/components/filters/TypeFilter.tsx',
          ],
          'ui-components': [
            './src/components/ui/OptimizedImage.tsx',
            './src/components/ui/TypeBadge.tsx',
            './src/components/ui/LoadingSpinner.tsx',
          ],
        },
        // Optimize chunk names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext || '')) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    // Optimize build
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Source maps for production debugging
    sourcemap: process.env.NODE_ENV === 'development',
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  // Development optimizations
  server: {
    hmr: {
      port: 24678,
    },
  },
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-i18next',
      'i18next',
    ],
  },
  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
})