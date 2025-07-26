/**
 * Image handling and optimization utilities
 */

export interface ImageLoadOptions {
  fallbackUrl?: string;
  placeholderUrl?: string;
  retryAttempts?: number;
  retryDelay?: number;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  lazy?: boolean;
}

/**
 * Preload an image
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

/**
 * Load image with fallback and retry logic
 */
export const loadImageWithFallback = async (
  src: string,
  options: ImageLoadOptions = {}
): Promise<string> => {
  const {
    fallbackUrl = '/images/pokemon-placeholder.png',
    retryAttempts = 2,
    retryDelay = 1000,
    onLoad,
    onError
  } = options;

  let lastError: Error | null = null;

  // Try loading the main image with retries
  for (let attempt = 0; attempt <= retryAttempts; attempt++) {
    try {
      await preloadImage(src);
      onLoad?.();
      return src;
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < retryAttempts) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }

  // Try fallback image
  if (fallbackUrl && fallbackUrl !== src) {
    try {
      await preloadImage(fallbackUrl);
      return fallbackUrl;
    } catch (fallbackError) {
      lastError = fallbackError as Error;
    }
  }

  // If all fails, call error handler and return fallback
  onError?.(lastError || new Error('Failed to load image'));
  return fallbackUrl;
};

/**
 * Generate Pokemon image URL with fallbacks
 */
export const getPokemonImageUrl = (
  pokemonId: number | string,
  variant: 'official' | 'artwork' | 'sprite' = 'official'
): string => {
  const id = typeof pokemonId === 'string' ? pokemonId : pokemonId.toString().padStart(3, '0');
  
  const baseUrls = {
    official: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
  };

  return baseUrls[variant];
};

/**
 * Generate multiple Pokemon image URLs for fallback chain
 */
export const getPokemonImageUrls = (pokemonId: number | string): string[] => {
  return [
    getPokemonImageUrl(pokemonId, 'official'),
    getPokemonImageUrl(pokemonId, 'artwork'),
    getPokemonImageUrl(pokemonId, 'sprite'),
    '/images/pokemon-placeholder.png'
  ];
};

/**
 * Check if image format is supported
 */
export const isImageFormatSupported = (format: string): boolean => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;

  try {
    return canvas.toDataURL(`image/${format}`).indexOf(`data:image/${format}`) === 0;
  } catch {
    return false;
  }
};

/**
 * Check if WebP is supported
 */
export const isWebPSupported = (): boolean => {
  return isImageFormatSupported('webp');
};

/**
 * Generate optimized image URL (placeholder for CDN integration)
 */
export const getOptimizedImageUrl = (
  src: string,
  options: ImageOptimizationOptions = {}
): string => {
  const { width, height, quality = 80, format } = options;
  
  // In a real application, this would integrate with a CDN like Cloudinary or ImageKit
  // For now, we'll return the original URL with query parameters for future CDN integration
  const url = new URL(src, window.location.origin);
  
  if (width) url.searchParams.set('w', width.toString());
  if (height) url.searchParams.set('h', height.toString());
  if (quality !== 80) url.searchParams.set('q', quality.toString());
  if (format) url.searchParams.set('f', format);
  
  return url.toString();
};

/**
 * Create responsive image srcSet
 */
export const createResponsiveSrcSet = (
  baseSrc: string,
  sizes: number[] = [320, 640, 1024, 1280]
): string => {
  return sizes
    .map(size => `${getOptimizedImageUrl(baseSrc, { width: size })} ${size}w`)
    .join(', ');
};

/**
 * Image cache for better performance
 */
class ImageCache {
  private cache = new Map<string, Promise<string>>();
  private maxSize = 100;

  async get(src: string, options?: ImageLoadOptions): Promise<string> {
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    const promise = loadImageWithFallback(src, options);
    
    // Manage cache size
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(src, promise);
    return promise;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(src: string): boolean {
    return this.cache.delete(src);
  }

  has(src: string): boolean {
    return this.cache.has(src);
  }
}

export const imageCache = new ImageCache();

/**
 * Lazy loading intersection observer
 */
export const createLazyLoadObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, defaultOptions);
};

/**
 * Generate placeholder data URL
 */
export const generatePlaceholderDataUrl = (
  width: number = 200,
  height: number = 200,
  color: string = '#f3f4f6'
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  // Add simple Pokemon ball icon
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 6;
  
  // Outer circle
  ctx.fillStyle = '#e5e7eb';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();
  
  // Inner circle
  ctx.fillStyle = '#9ca3af';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius / 3, 0, 2 * Math.PI);
  ctx.fill();
  
  return canvas.toDataURL();
};

/**
 * Image error tracking for analytics
 */
export const trackImageError = (src: string, error: Error): void => {
  // In a real application, this would send error data to analytics service
  console.warn('Image load error:', { src, error: error.message });
  
  // Example: Send to analytics service
  // analytics.track('image_load_error', { src, error: error.message });
};