import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  loadImageWithFallback,
  getPokemonImageUrls,
  createLazyLoadObserver,
  generatePlaceholderDataUrl,
  trackImageError,
  imageCache,
  type ImageLoadOptions
} from '../../utils/imageUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  pokemonId?: number | string;
  width?: number;
  height?: number;
  className?: string;
  lazy?: boolean;
  placeholder?: string | boolean;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  retryAttempts?: number;
  quality?: number;
  sizes?: string;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  pokemonId,
  width,
  height,
  className = '',
  lazy = true,
  placeholder = true,
  fallbackSrc,
  onLoad,
  onError,
  retryAttempts = 2,
  quality = 80,
  sizes,
  priority = false
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate placeholder
  const placeholderSrc = typeof placeholder === 'string' 
    ? placeholder 
    : placeholder 
      ? generatePlaceholderDataUrl(width, height)
      : '';

  // Get image URLs with fallbacks
  const getImageUrls = useCallback(() => {
    if (pokemonId) {
      return getPokemonImageUrls(pokemonId);
    }
    
    const urls = [src];
    if (fallbackSrc) urls.push(fallbackSrc);
    urls.push('/images/pokemon-placeholder.png');
    
    return urls;
  }, [src, pokemonId, fallbackSrc]);

  // Load image with fallback chain
  const loadImage = useCallback(async () => {
    if (!isInView) return;

    setIsLoading(true);
    setHasError(false);

    const urls = getImageUrls();
    let loadedSrc = '';
    let lastError: Error | null = null;

    // Try each URL in the fallback chain
    for (const url of urls) {
      try {
        const options: ImageLoadOptions = {
          retryAttempts,
          onLoad: () => {
            setIsLoading(false);
            onLoad?.();
          },
          onError: (error) => {
            lastError = error;
            trackImageError(url, error);
          }
        };

        loadedSrc = await imageCache.get(url, options);
        break;
      } catch (error) {
        lastError = error as Error;
        continue;
      }
    }

    if (loadedSrc) {
      setCurrentSrc(loadedSrc);
      setIsLoading(false);
    } else {
      setHasError(true);
      setIsLoading(false);
      onError?.(lastError || new Error('Failed to load image'));
    }
  }, [isInView, getImageUrls, retryAttempts, onLoad, onError]);

  // Set up lazy loading observer
  useEffect(() => {
    if (!lazy || priority || !imgRef.current) return;

    observerRef.current = createLazyLoadObserver(
      (entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.unobserve(entry.target);
        }
      },
      { rootMargin: '50px' }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy, priority]);

  // Load image when in view
  useEffect(() => {
    if (isInView) {
      loadImage();
    }
  }, [isInView, loadImage]);

  // Handle retry
  const handleRetry = useCallback(() => {
    loadImage();
  }, [loadImage]);

  // Render loading state
  if (isLoading && placeholderSrc) {
    return (
      <div 
        ref={imgRef}
        className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}
        style={{ width, height }}
      >
        <img
          src={placeholderSrc}
          alt=""
          className="w-full h-full object-cover opacity-50"
          aria-hidden="true"
        />
        
        {/* Loading spinner */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Render error state
  if (hasError) {
    return (
      <div 
        ref={imgRef}
        className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <svg
          className="w-8 h-8 text-gray-400 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-xs text-gray-500 mb-2">Failed to load</span>
        <button
          onClick={handleRetry}
          className="text-xs text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  // Render loaded image
  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      loading={lazy && !priority ? 'lazy' : 'eager'}
      decoding="async"
      onLoad={() => {
        setIsLoading(false);
        onLoad?.();
      }}
      onError={(e) => {
        const error = new Error(`Failed to load image: ${currentSrc}`);
        setHasError(true);
        setIsLoading(false);
        trackImageError(currentSrc, error);
        onError?.(error);
      }}
    />
  );
};

// Specialized Pokemon image component
interface PokemonImageProps extends Omit<OptimizedImageProps, 'src' | 'pokemonId'> {
  pokemonId: number | string;
  pokemonName: string;
  variant?: 'official' | 'artwork' | 'sprite';
}

export const PokemonImage: React.FC<PokemonImageProps> = ({
  pokemonId,
  pokemonName,
  variant = 'official',
  alt,
  ...props
}) => {
  const src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/${variant === 'official' ? 'official-artwork' : variant}/${pokemonId}.png`;
  
  return (
    <OptimizedImage
      src={src}
      alt={alt || `${pokemonName} ${variant}`}
      pokemonId={pokemonId}
      {...props}
    />
  );
};

// Image preloader component for critical images
interface ImagePreloaderProps {
  images: string[];
  onComplete?: () => void;
}

export const ImagePreloader: React.FC<ImagePreloaderProps> = ({
  images,
  onComplete
}) => {
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    const preloadImages = async () => {
      const promises = images.map(async (src) => {
        try {
          await imageCache.get(src);
          setLoadedCount(prev => prev + 1);
        } catch (error) {
          // Ignore preload errors
          setLoadedCount(prev => prev + 1);
        }
      });

      await Promise.all(promises);
      onComplete?.();
    };

    if (images.length > 0) {
      preloadImages();
    }
  }, [images, onComplete]);

  // This component doesn't render anything visible
  return null;
};