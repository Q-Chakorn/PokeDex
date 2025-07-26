import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  preloadImage,
  loadImageWithFallback,
  getPokemonImageUrl,
  getPokemonImageUrls,
  isImageFormatSupported,
  isWebPSupported,
  getOptimizedImageUrl,
  createResponsiveSrcSet,
  imageCache,
  createLazyLoadObserver,
  generatePlaceholderDataUrl,
  trackImageError
} from '../imageUtils';

// Mock Image constructor
global.Image = class {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src: string = '';

  constructor() {
    setTimeout(() => {
      if (this.src.includes('success')) {
        this.onload?.();
      } else if (this.src.includes('error')) {
        this.onerror?.();
      }
    }, 10);
  }
} as any;

// Mock HTMLCanvasElement
const mockCanvas = {
  getContext: vi.fn().mockReturnValue({
    fillStyle: '',
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
  }),
  toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mock'),
  width: 0,
  height: 0,
};

global.HTMLCanvasElement = vi.fn().mockImplementation(() => mockCanvas);
document.createElement = vi.fn().mockImplementation((tagName) => {
  if (tagName === 'canvas') {
    return mockCanvas;
  }
  return {};
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  callback,
}));

// Mock console.warn for trackImageError
const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('imageUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    imageCache.clear();
  });

  afterEach(() => {
    consoleSpy.mockClear();
  });

  describe('preloadImage', () => {
    it('should resolve when image loads successfully', async () => {
      const result = await preloadImage('success.jpg');
      expect(result).toBeInstanceOf(Image);
    });

    it('should reject when image fails to load', async () => {
      await expect(preloadImage('error.jpg')).rejects.toThrow('Failed to load image: error.jpg');
    });
  });

  describe('loadImageWithFallback', () => {
    it('should return original src when it loads successfully', async () => {
      const result = await loadImageWithFallback('success.jpg');
      expect(result).toBe('success.jpg');
    });

    it('should return fallback when original fails', async () => {
      const result = await loadImageWithFallback('error.jpg', {
        fallbackUrl: 'fallback-success.jpg'
      });
      expect(result).toBe('fallback-success.jpg');
    });

    it('should call onLoad callback when successful', async () => {
      const onLoad = vi.fn();
      await loadImageWithFallback('success.jpg', { onLoad });
      expect(onLoad).toHaveBeenCalled();
    });

    it('should call onError callback when all attempts fail', async () => {
      const onError = vi.fn();
      await loadImageWithFallback('error.jpg', {
        fallbackUrl: 'error-fallback.jpg',
        onError
      });
      expect(onError).toHaveBeenCalled();
    });

    it('should retry specified number of times', async () => {
      const result = await loadImageWithFallback('error.jpg', {
        retryAttempts: 3,
        retryDelay: 1,
        fallbackUrl: 'fallback-success.jpg'
      });
      expect(result).toBe('fallback-success.jpg');
    });
  });

  describe('getPokemonImageUrl', () => {
    it('should generate official artwork URL by default', () => {
      const url = getPokemonImageUrl(25);
      expect(url).toBe('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/025.png');
    });

    it('should generate artwork URL when specified', () => {
      const url = getPokemonImageUrl(25, 'artwork');
      expect(url).toBe('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/025.png');
    });

    it('should generate sprite URL when specified', () => {
      const url = getPokemonImageUrl(25, 'sprite');
      expect(url).toBe('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/025.png');
    });

    it('should handle string ID', () => {
      const url = getPokemonImageUrl('25');
      expect(url).toBe('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/025.png');
    });

    it('should pad single digit IDs', () => {
      const url = getPokemonImageUrl(1);
      expect(url).toBe('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/001.png');
    });
  });

  describe('getPokemonImageUrls', () => {
    it('should return array of fallback URLs', () => {
      const urls = getPokemonImageUrls(25);
      expect(urls).toHaveLength(4);
      expect(urls[0]).toContain('official-artwork');
      expect(urls[1]).toContain('home');
      expect(urls[2]).toContain('sprites/pokemon');
      expect(urls[3]).toBe('/images/pokemon-placeholder.png');
    });
  });

  describe('isImageFormatSupported', () => {
    it('should return true for supported format', () => {
      mockCanvas.toDataURL.mockReturnValue('data:image/webp;base64,mock');
      const result = isImageFormatSupported('webp');
      expect(result).toBe(true);
    });

    it('should return false for unsupported format', () => {
      mockCanvas.toDataURL.mockReturnValue('data:image/png;base64,mock');
      const result = isImageFormatSupported('webp');
      expect(result).toBe(false);
    });

    it('should handle canvas context error', () => {
      mockCanvas.getContext.mockReturnValueOnce(null);
      const result = isImageFormatSupported('webp');
      expect(result).toBe(false);
    });
  });

  describe('isWebPSupported', () => {
    it('should check WebP support', () => {
      mockCanvas.toDataURL.mockReturnValue('data:image/webp;base64,mock');
      const result = isWebPSupported();
      expect(result).toBe(true);
    });
  });

  describe('getOptimizedImageUrl', () => {
    beforeEach(() => {
      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: { origin: 'http://localhost:3000' },
        writable: true,
      });
    });

    it('should add width parameter', () => {
      const url = getOptimizedImageUrl('image.jpg', { width: 300 });
      expect(url).toContain('w=300');
    });

    it('should add height parameter', () => {
      const url = getOptimizedImageUrl('image.jpg', { height: 200 });
      expect(url).toContain('h=200');
    });

    it('should add quality parameter', () => {
      const url = getOptimizedImageUrl('image.jpg', { quality: 90 });
      expect(url).toContain('q=90');
    });

    it('should add format parameter', () => {
      const url = getOptimizedImageUrl('image.jpg', { format: 'webp' });
      expect(url).toContain('f=webp');
    });

    it('should not add quality parameter for default value', () => {
      const url = getOptimizedImageUrl('image.jpg', { quality: 80 });
      expect(url).not.toContain('q=80');
    });
  });

  describe('createResponsiveSrcSet', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: { origin: 'http://localhost:3000' },
        writable: true,
      });
    });

    it('should create srcSet with default sizes', () => {
      const srcSet = createResponsiveSrcSet('image.jpg');
      expect(srcSet).toContain('320w');
      expect(srcSet).toContain('640w');
      expect(srcSet).toContain('1024w');
      expect(srcSet).toContain('1280w');
    });

    it('should create srcSet with custom sizes', () => {
      const srcSet = createResponsiveSrcSet('image.jpg', [400, 800]);
      expect(srcSet).toContain('400w');
      expect(srcSet).toContain('800w');
      expect(srcSet).not.toContain('320w');
    });
  });

  describe('ImageCache', () => {
    it('should cache successful loads', async () => {
      const result1 = await imageCache.get('success.jpg');
      const result2 = await imageCache.get('success.jpg');
      
      expect(result1).toBe('success.jpg');
      expect(result2).toBe('success.jpg');
      expect(imageCache.has('success.jpg')).toBe(true);
    });

    it('should manage cache size', async () => {
      // Fill cache beyond max size
      for (let i = 0; i < 105; i++) {
        await imageCache.get(`success-${i}.jpg`);
      }
      
      // Should not exceed max size
      expect(imageCache.has('success-0.jpg')).toBe(false);
      expect(imageCache.has('success-104.jpg')).toBe(true);
    });

    it('should allow manual cache management', () => {
      imageCache.get('success.jpg');
      expect(imageCache.has('success.jpg')).toBe(true);
      
      imageCache.delete('success.jpg');
      expect(imageCache.has('success.jpg')).toBe(false);
      
      imageCache.clear();
      expect(imageCache.has('success.jpg')).toBe(false);
    });
  });

  describe('createLazyLoadObserver', () => {
    it('should create IntersectionObserver with default options', () => {
      const callback = vi.fn();
      const observer = createLazyLoadObserver(callback);
      
      expect(IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          root: null,
          rootMargin: '50px',
          threshold: 0.1,
        })
      );
    });

    it('should create IntersectionObserver with custom options', () => {
      const callback = vi.fn();
      const options = { rootMargin: '100px', threshold: 0.5 };
      const observer = createLazyLoadObserver(callback, options);
      
      expect(IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining(options)
      );
    });
  });

  describe('generatePlaceholderDataUrl', () => {
    it('should generate placeholder with default dimensions', () => {
      const dataUrl = generatePlaceholderDataUrl();
      expect(dataUrl).toBe('data:image/png;base64,mock');
      expect(mockCanvas.width).toBe(200);
      expect(mockCanvas.height).toBe(200);
    });

    it('should generate placeholder with custom dimensions', () => {
      const dataUrl = generatePlaceholderDataUrl(300, 400, '#ff0000');
      expect(dataUrl).toBe('data:image/png;base64,mock');
      expect(mockCanvas.width).toBe(300);
      expect(mockCanvas.height).toBe(400);
    });

    it('should handle canvas context error', () => {
      mockCanvas.getContext.mockReturnValueOnce(null);
      const dataUrl = generatePlaceholderDataUrl();
      expect(dataUrl).toBe('');
    });
  });

  describe('trackImageError', () => {
    it('should log error to console', () => {
      const error = new Error('Test error');
      trackImageError('test.jpg', error);
      
      expect(consoleSpy).toHaveBeenCalledWith('Image load error:', {
        src: 'test.jpg',
        error: 'Test error'
      });
    });
  });
});