import type { Theme, Language } from '../types/app';

const THEME_KEY = 'pokedex-theme';
const LANGUAGE_KEY = 'pokedex-language';

/**
 * Save theme preference to localStorage
 */
export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
}

/**
 * Load theme preference from localStorage
 */
export function loadTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error);
  }

  // Default to light theme or system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  return 'light';
}

/**
 * Save language preference to localStorage
 */
export function saveLanguage(language: Language): void {
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.warn('Failed to save language to localStorage:', error);
  }
}

/**
 * Load language preference from localStorage
 */
export function loadLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved === 'en' || saved === 'th') {
      return saved;
    }
  } catch (error) {
    console.warn('Failed to load language from localStorage:', error);
  }

  // Default to English or browser language
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('th')) {
      return 'th';
    }
  }
  
  return 'en';
}