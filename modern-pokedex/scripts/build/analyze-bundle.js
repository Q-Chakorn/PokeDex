#!/usr/bin/env node

/**
 * Bundle Analysis Script for Modern Pokédex
 * Analyzes the production build bundle size and composition
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeDirectory(dirPath, basePath = '') {
  const files = [];
  const items = readdirSync(dirPath);

  for (const item of items) {
    const fullPath = join(dirPath, item);
    const relativePath = join(basePath, item);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...analyzeDirectory(fullPath, relativePath));
    } else {
      files.push({
        path: relativePath,
        size: stats.size,
        extension: extname(item).toLowerCase(),
      });
    }
  }

  return files;
}

function categorizeFiles(files) {
  const categories = {
    javascript: { files: [], totalSize: 0 },
    css: { files: [], totalSize: 0 },
    images: { files: [], totalSize: 0 },
    fonts: { files: [], totalSize: 0 },
    other: { files: [], totalSize: 0 },
  };

  for (const file of files) {
    let category = 'other';
    
    if (['.js', '.mjs', '.ts'].includes(file.extension)) {
      category = 'javascript';
    } else if (['.css', '.scss', '.sass'].includes(file.extension)) {
      category = 'css';
    } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'].includes(file.extension)) {
      category = 'images';
    } else if (['.woff', '.woff2', '.ttf', '.eot'].includes(file.extension)) {
      category = 'fonts';
    }

    categories[category].files.push(file);
    categories[category].totalSize += file.size;
  }

  return categories;
}

function printAnalysis() {
  console.log(`${colors.bright}${colors.cyan}📦 Modern Pokédx Bundle Analysis${colors.reset}\n`);

  const distPath = join(__dirname, '../../dist');
  
  try {
    const files = analyzeDirectory(distPath);
    const categories = categorizeFiles(files);
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    // Overall summary
    console.log(`${colors.bright}📊 Overall Summary${colors.reset}`);
    console.log(`Total files: ${colors.yellow}${files.length}${colors.reset}`);
    console.log(`Total size: ${colors.yellow}${formatBytes(totalSize)}${colors.reset}\n`);

    // Category breakdown
    console.log(`${colors.bright}📋 Category Breakdown${colors.reset}`);
    
    Object.entries(categories).forEach(([category, data]) => {
      if (data.files.length > 0) {
        const percentage = ((data.totalSize / totalSize) * 100).toFixed(1);
        const color = category === 'javascript' ? colors.green : 
                     category === 'css' ? colors.blue :
                     category === 'images' ? colors.magenta :
                     category === 'fonts' ? colors.cyan : colors.yellow;
        
        console.log(`${color}${category.toUpperCase()}${colors.reset}: ${formatBytes(data.totalSize)} (${percentage}%) - ${data.files.length} files`);
      }
    });

    console.log('');

    // Largest files
    console.log(`${colors.bright}📈 Largest Files${colors.reset}`);
    const largestFiles = files
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);

    largestFiles.forEach((file, index) => {
      const color = file.extension === '.js' ? colors.green :
                   file.extension === '.css' ? colors.blue :
                   file.extension.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)/) ? colors.magenta :
                   colors.reset;
      
      console.log(`${index + 1}. ${color}${file.path}${colors.reset} - ${formatBytes(file.size)}`);
    });

    console.log('');

    // Performance recommendations
    console.log(`${colors.bright}💡 Performance Recommendations${colors.reset}`);
    
    const jsSize = categories.javascript.totalSize;
    const cssSize = categories.css.totalSize;
    const imageSize = categories.images.totalSize;

    if (jsSize > 500 * 1024) { // 500KB
      console.log(`${colors.yellow}⚠️  JavaScript bundle is large (${formatBytes(jsSize)}). Consider code splitting.${colors.reset}`);
    } else {
      console.log(`${colors.green}✅ JavaScript bundle size is good (${formatBytes(jsSize)})${colors.reset}`);
    }

    if (cssSize > 100 * 1024) { // 100KB
      console.log(`${colors.yellow}⚠️  CSS bundle is large (${formatBytes(cssSize)}). Consider purging unused styles.${colors.reset}`);
    } else {
      console.log(`${colors.green}✅ CSS bundle size is good (${formatBytes(cssSize)})${colors.reset}`);
    }

    if (imageSize > 1024 * 1024) { // 1MB
      console.log(`${colors.yellow}⚠️  Images are large (${formatBytes(imageSize)}). Consider optimization.${colors.reset}`);
    } else {
      console.log(`${colors.green}✅ Image sizes are reasonable (${formatBytes(imageSize)})${colors.reset}`);
    }

    // Gzip estimation
    console.log('');
    console.log(`${colors.bright}📦 Estimated Gzipped Sizes${colors.reset}`);
    console.log(`JavaScript: ~${formatBytes(jsSize * 0.3)} (estimated)`);
    console.log(`CSS: ~${formatBytes(cssSize * 0.2)} (estimated)`);
    console.log(`Total: ~${formatBytes(totalSize * 0.25)} (estimated)`);

  } catch (error) {
    console.error(`${colors.red}❌ Error analyzing bundle:${colors.reset}`, error.message);
    console.log(`${colors.yellow}💡 Make sure to run 'npm run build' first${colors.reset}`);
    process.exit(1);
  }
}

// Run the analysis
printAnalysis();
