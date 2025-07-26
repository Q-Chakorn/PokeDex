import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { LanguageProvider, useLanguage } from '../LanguageContext';

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

// Mock navigator.language
Object.defineProperty(navigator, 'language', {
  value: 'en-US',
  configurable: true,
});

// Test component that uses the language context
const TestComponent = () => {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div>
      <span data-testid="current-language">{language}</span>
      <span data-testid="translated-text">{t('app.title')}</span>
      <button data-testid="set-english" onClick={() => setLanguage('en')}>
        Set English
      </button>
      <button data-testid="set-thai" onClick={() => setLanguage('th')}>
        Set Thai
      </button>
    </div>
  );
};

const renderWithProviders = (initialLanguage: 'en' | 'th' = 'en') => {
  localStorageMock.getItem.mockReturnValue(initialLanguage);
  
  return render(
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    </I18nextProvider>
  );
};

describe('LanguageContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    i18n.changeLanguage('en');
  });

  it('should provide default English language when no saved preference', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toHaveTextContent('en');
    });
  });

  it('should load saved language from localStorage', async () => {
    renderWithProviders('th');

    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toHaveTextContent('th');
    });
  });

  it('should change language to Thai', async () => {
    renderWithProviders('en');

    fireEvent.click(screen.getByTestId('set-thai'));
    
    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toHaveTextContent('th');
    });
  });

  it('should change language to English', async () => {
    renderWithProviders('th');

    fireEvent.click(screen.getByTestId('set-english'));
    
    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toHaveTextContent('en');
    });
  });

  it('should save language to localStorage when changed', async () => {
    renderWithProviders('en');

    fireEvent.click(screen.getByTestId('set-thai'));
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('pokedex-language', 'th');
    });
  });

  it('should update translations when language changes', async () => {
    renderWithProviders('en');

    // Check English translation
    await waitFor(() => {
      expect(screen.getByTestId('translated-text')).toHaveTextContent('Modern Pokédex');
    });

    fireEvent.click(screen.getByTestId('set-thai'));
    
    // Check Thai translation
    await waitFor(() => {
      expect(screen.getByTestId('translated-text')).toHaveTextContent('โมเดิร์น โปเกเด็กซ์');
    });
  });

  it('should provide translation function', async () => {
    renderWithProviders();

    await waitFor(() => {
      const translatedText = screen.getByTestId('translated-text');
      expect(translatedText).toHaveTextContent('Modern Pokédex');
    });
  });

  it('should throw error when useLanguage is used outside LanguageProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(
        <I18nextProvider i18n={i18n}>
          <TestComponent />
        </I18nextProvider>
      );
    }).toThrow('useLanguage must be used within a LanguageProvider');
    
    consoleSpy.mockRestore();
  });

  it('should initialize i18n with saved language', async () => {
    const changeLanguageSpy = vi.spyOn(i18n, 'changeLanguage');
    
    renderWithProviders('th');

    await waitFor(() => {
      expect(changeLanguageSpy).toHaveBeenCalledWith('th');
    });
    
    changeLanguageSpy.mockRestore();
  });
});