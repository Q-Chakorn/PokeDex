import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OptimizedImage, PokemonImage, ImagePreloader } from '../OptimizedImage';

// Mock image utilities
vi.mock('../../utils/imageUtils', () => ({
  loadImageWithFallback: vi.fn(),
  getPokemonImageUrls: vi.fn(),
  createLazyLoadObserver: vi.fn(),
  generatePlaceholderDataUrl: vi.fn(),
  trackImageError: vi.fn(),
  imageCache: {
    get: vi.fn(),
    clear: vi.fn(),
    delete: vi.fn(),
    has: vi.fn(),
  },
}));

// Mock IntersectionObserver
const mockObserver = {
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
};

global.IntersectionObserver = vi.fn().mockImplementation(() => mockObserver);

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

const mockImageUtils = vi.mocked(await import('../../utils/imageUtils'));

describe('OptimizedImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockImageUtils.generatePlaceholderDataUrl.mockReturnValue('data:image/png;base64,placeholder');
    mockImageUtils.getPokemonImageUrls.mockReturnValue([
      'pokemon1.png',
      'pokemon2.png',
      'fallback.png'
    ]);
    mockImageUtils.loadImageWithFallback.mockResolvedValue('success.jpg');
    mockImageUtils.imageCache.get.mockResolvedValue('success.jpg');
  });

  it('should render image when loaded successfully', async () => {
    render(
      <OptimizedImage
        src="success.jpg"
        alt="Test image"
        lazy={false}
      />
    );

    await waitFor(() => {
      const img = screen.getByAltText('Test image');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'success.jpg');
    });
  });

  it('should show placeholder while loading', () => {
    render(
      <OptimizedImage
        src="test.jpg"
        alt="Test image"
        lazy={false}
        placeholder={true}
      />
    );

    expect(screen.getByRole('img', { hidden: true })).toHaveAttribute(
      'src',
      'data:image/png;base64,placeholder'
    );
  });

  it('should show custom placeholder', () => {
    render(
      <OptimizedImage
        src="test.jpg"
        alt="Test image"
        lazy={false}
        placeholder="custom-placeholder.jpg"
      />
    );

    expect(screen.getByRole('img', { hidden: true })).toHaveAttribute(
      'src',
      'custom-placeholder.jpg'
    );
  });

  it('should handle loading error and show retry button', async () => {
    mockImageUtils.imageCache.get.mockRejectedValue(new Error('Load failed'));

    render(
      <OptimizedImage
        src="error.jpg"
        alt="Test image"
        lazy={false}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  it('should retry loading when retry button is clicked', async () => {
    mockImageUtils.imageCache.get
      .mockRejectedValueOnce(new Error('Load failed'))
      .mockResolvedValueOnce('success.jpg');

    render(
      <OptimizedImage
        src="error.jpg"
        alt="Test image"
        lazy={false}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    await waitFor(() => {
      const img = screen.getByAltText('Test image');
      expect(img).toHaveAttribute('src', 'success.jpg');
    });
  });

  it('should use Pokemon image URLs when pokemonId is provided', async () => {
    render(
      <OptimizedImage
        src="test.jpg"
        alt="Pokemon image"
        pokemonId={25}
        lazy={false}
      />
    );

    expect(mockImageUtils.getPokemonImageUrls).toHaveBeenCalledWith(25);
  });

  it('should handle lazy loading', () => {
    render(
      <OptimizedImage
        src="test.jpg"
        alt="Test image"
        lazy={true}
      />
    );

    expect(mockImageUtils.createLazyLoadObserver).toHaveBeenCalled();
  });

  it('should skip lazy loading for priority images', async () => {
    render(
      <OptimizedImage
        src="success.jpg"
        alt="Test image"
        lazy={true}
        priority={true}
      />
    );

    await waitFor(() => {
      const img = screen.getByAltText('Test image');
      expect(img).toBeInTheDocument();
    });

    expect(mockImageUtils.createLazyLoadObserver).not.toHaveBeenCalled();
  });

  it('should call onLoad callback when image loads', async () => {
    const onLoad = vi.fn();

    render(
      <OptimizedImage
        src="success.jpg"
        alt="Test image"
        lazy={false}
        onLoad={onLoad}
      />
    );

    await waitFor(() => {
      expect(onLoad).toHaveBeenCalled();
    });
  });

  it('should call onError callback when image fails', async () => {
    const onError = vi.fn();
    mockImageUtils.imageCache.get.mockRejectedValue(new Error('Load failed'));

    render(
      <OptimizedImage
        src="error.jpg"
        alt="Test image"
        lazy={false}
        onError={onError}
      />
    );

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });

  it('should apply custom className', async () => {
    render(
      <OptimizedImage
        src="success.jpg"
        alt="Test image"
        lazy={false}
        className="custom-class"
      />
    );

    await waitFor(() => {
      const img = screen.getByAltText('Test image');
      expect(img).toHaveClass('custom-class');
    });
  });

  it('should set loading attribute based on lazy prop', async () => {
    const { rerender } = render(
      <OptimizedImage
        src="success.jpg"
        alt="Test image"
        lazy={true}
        priority={false}
      />
    );

    await waitFor(() => {
      const img = screen.getByAltText('Test image');
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    rerender(
      <OptimizedImage
        src="success.jpg"
        alt="Test image"
        lazy={false}
        priority={false}
      />
    );

    await waitFor(() => {
      const img = screen.getByAltText('Test image');
      expect(img).toHaveAttribute('loading', 'eager');
    });
  });

  it('should set dimensions when provided', async () => {
    render(
      <OptimizedImage
        src="success.jpg"
        alt="Test image"
        lazy={false}
        width={300}
        height={200}
      />
    );

    await waitFor(() => {
      const img = screen.getByAltText('Test image');
      expect(img).toHaveAttribute('width', '300');
      expect(img).toHaveAttribute('height', '200');
    });
  });
});

describe('PokemonImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockImageUtils.imageCache.get.mockResolvedValue('pokemon-success.jpg');
  });

  it('should render Pokemon image with correct src', async () => {
    render(
      <PokemonImage
        pokemonId={25}
        pokemonName="Pikachu"
        lazy={false}
      />
    );

    await waitFor(() => {
      const img = screen.getByAltText('Pikachu official');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'pokemon-success.jpg');
    });
  });

  it('should use custom alt text when provided', async () => {
    render(
      <PokemonImage
        pokemonId={25}
        pokemonName="Pikachu"
        alt="Custom alt text"
        lazy={false}
      />
    );

    await waitFor(() => {
      const img = screen.getByAltText('Custom alt text');
      expect(img).toBeInTheDocument();
    });
  });

  it('should handle different variants', async () => {
    render(
      <PokemonImage
        pokemonId={25}
        pokemonName="Pikachu"
        variant="sprite"
        lazy={false}
      />
    );

    await waitFor(() => {
      const img = screen.getByAltText('Pikachu sprite');
      expect(img).toBeInTheDocument();
    });
  });
});

describe('ImagePreloader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockImageUtils.imageCache.get.mockResolvedValue('preloaded.jpg');
  });

  it('should preload images and call onComplete', async () => {
    const onComplete = vi.fn();
    const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];

    render(
      <ImagePreloader
        images={images}
        onComplete={onComplete}
      />
    );

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });

    expect(mockImageUtils.imageCache.get).toHaveBeenCalledTimes(3);
    expect(mockImageUtils.imageCache.get).toHaveBeenCalledWith('image1.jpg');
    expect(mockImageUtils.imageCache.get).toHaveBeenCalledWith('image2.jpg');
    expect(mockImageUtils.imageCache.get).toHaveBeenCalledWith('image3.jpg');
  });

  it('should handle preload errors gracefully', async () => {
    const onComplete = vi.fn();
    const images = ['image1.jpg', 'error.jpg'];

    mockImageUtils.imageCache.get
      .mockResolvedValueOnce('image1.jpg')
      .mockRejectedValueOnce(new Error('Preload failed'));

    render(
      <ImagePreloader
        images={images}
        onComplete={onComplete}
      />
    );

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
  });

  it('should not render any visible content', () => {
    const { container } = render(
      <ImagePreloader
        images={['image1.jpg']}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should handle empty images array', () => {
    const onComplete = vi.fn();

    render(
      <ImagePreloader
        images={[]}
        onComplete={onComplete}
      />
    );

    expect(mockImageUtils.imageCache.get).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
  });
});