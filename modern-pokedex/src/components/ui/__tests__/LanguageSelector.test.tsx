import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { LanguageSelector } from '../LanguageSelector';

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

const renderWithI18n = (initialLanguage: 'en' | 'th' = 'en') => {
  localStorageMock.getItem.mockReturnValue(initialLanguage);
  i18n.changeLanguage(initialLanguage);
  
  return render(
    <I18nextProvider i18n={i18n}>
      <LanguageSelector />
    </I18nextProvider>
  );
};

describe('LanguageSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render language selector', async () => {
    renderWithI18n();
    
    await waitFor(() => {
      const selector = screen.getByRole('combobox');
      expect(selector).toBeInTheDocument();
    });
  });

  it('should show current language as selected', async () => {
    renderWithI18n('en');
    
    await waitFor(() => {
      const selector = screen.getByRole('combobox') as HTMLSelectElement;
      expect(selector.value).toBe('en');
    });
  });

  it('should show Thai as selected when language is Thai', async () => {
    renderWithI18n('th');
    
    await waitFor(() => {
      const selector = screen.getByRole('combobox') as HTMLSelectElement;
      expect(selector.value).toBe('th');
    });
  });

  it('should have correct aria-label', async () => {
    renderWithI18n();
    
    await waitFor(() => {
      const selector = screen.getByRole('combobox');
      expect(selector).toHaveAttribute('aria-label', 'Select language');
    });
  });

  it('should change language when option is selected', async () => {
    const changeLanguageSpy = vi.spyOn(i18n, 'changeLanguage');
    
    renderWithI18n('en');
    
    await waitFor(() => {
      const selector = screen.getByRole('combobox');
      fireEvent.change(selector, { target: { value: 'th' } });
    });
    
    expect(changeLanguageSpy).toHaveBeenCalledWith('th');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('pokedex-language', 'th');
    
    changeLanguageSpy.mockRestore();
  });

  it('should save language preference to localStorage', async () => {
    renderWithI18n('en');
    
    await waitFor(() => {
      const selector = screen.getByRole('combobox');
      fireEvent.change(selector, { target: { value: 'th' } });
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('pokedex-language', 'th');
  });

  it('should display English and Thai options', async () => {
    renderWithI18n();
    
    await waitFor(() => {
      const englishOption = screen.getByText('English');
      const thaiOption = screen.getByText('ไทย');
      
      expect(englishOption).toBeInTheDocument();
      expect(thaiOption).toBeInTheDocument();
    });
  });

  it('should have proper styling classes', async () => {
    renderWithI18n();
    
    await waitFor(() => {
      const selector = screen.getByRole('combobox');
      expect(selector).toHaveClass('appearance-none', 'bg-transparent', 'border');
    });
  });

  it('should show dropdown arrow icon', async () => {
    renderWithI18n();
    
    await waitFor(() => {
      const container = screen.getByRole('combobox').parentElement;
      const arrow = container?.querySelector('svg');
      expect(arrow).toBeInTheDocument();
    });
  });

  it('should handle focus and hover states', async () => {
    renderWithI18n();
    
    await waitFor(() => {
      const selector = screen.getByRole('combobox');
      expect(selector).toHaveClass('focus:outline-none', 'focus:ring-2', 'hover:border-gray-400');
    });
  });
});