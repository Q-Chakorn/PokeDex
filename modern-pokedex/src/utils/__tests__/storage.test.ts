import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveTheme, loadTheme, saveLanguage, loadLanguage } from '../storage';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('storage utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('theme storage', () => {
    it('should save theme to localStorage', () => {
      saveTheme('dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('pokedex-theme', 'dark');
    });

    it('should load theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      const result = loadTheme();
      expect(result).toBe('dark');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('pokedex-theme');
    });

    it('should return light theme as default when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null);
      const result = loadTheme();
      expect(result).toBe('light');
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Should not throw
      expect(() => saveTheme('dark')).not.toThrow();
    });

    it('should detect system dark mode preference', () => {
      localStorageMock.getItem.mockReturnValue(null);
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const result = loadTheme();
      expect(result).toBe('dark');
    });
  });

  describe('language storage', () => {
    it('should save language to localStorage', () => {
      saveLanguage('th');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('pokedex-language', 'th');
    });

    it('should load language from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('th');
      const result = loadLanguage();
      expect(result).toBe('th');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('pokedex-language');
    });

    it('should return en as default when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null);
      const result = loadLanguage();
      expect(result).toBe('en');
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Should not throw
      expect(() => saveLanguage('th')).not.toThrow();
    });

    it('should detect Thai browser language', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      // Mock navigator.language
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'th-TH',
      });

      const result = loadLanguage();
      expect(result).toBe('th');
    });

    it('should default to English for non-Thai browser language', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      // Mock navigator.language
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'ja-JP',
      });

      const result = loadLanguage();
      expect(result).toBe('en');
    });
  });
});