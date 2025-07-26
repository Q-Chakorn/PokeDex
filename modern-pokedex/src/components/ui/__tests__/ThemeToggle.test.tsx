import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeToggle } from '../ThemeToggle';
import { ThemeProvider } from '../../../contexts/ThemeContext';

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
  value: vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }),
});

const renderWithThemeProvider = (initialTheme: 'light' | 'dark' = 'light') => {
  localStorageMock.getItem.mockReturnValue(initialTheme);
  
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
};

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.className = '';
  });

  it('should render toggle button', () => {
    renderWithThemeProvider();
    
    const button = screen.getByRole('switch');
    expect(button).toBeInTheDocument();
  });

  it('should have correct aria-label for light theme', () => {
    renderWithThemeProvider('light');
    
    const button = screen.getByRole('switch');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('should have correct aria-label for dark theme', () => {
    renderWithThemeProvider('dark');
    
    const button = screen.getByRole('switch');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  it('should have correct aria-checked for light theme', () => {
    renderWithThemeProvider('light');
    
    const button = screen.getByRole('switch');
    expect(button).toHaveAttribute('aria-checked', 'false');
  });

  it('should have correct aria-checked for dark theme', () => {
    renderWithThemeProvider('dark');
    
    const button = screen.getByRole('switch');
    expect(button).toHaveAttribute('aria-checked', 'true');
  });

  it('should toggle theme when clicked', () => {
    renderWithThemeProvider('light');
    
    const button = screen.getByRole('switch');
    fireEvent.click(button);
    
    // After click, should save dark theme to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should show sun icon in light mode', () => {
    renderWithThemeProvider('light');
    
    const button = screen.getByRole('switch');
    const sunIcon = button.querySelector('svg:first-of-type');
    
    expect(sunIcon).toHaveClass('opacity-100');
  });

  it('should show moon icon in dark mode', () => {
    renderWithThemeProvider('dark');
    
    const button = screen.getByRole('switch');
    const moonIcon = button.querySelector('svg:last-of-type');
    
    expect(moonIcon).toHaveClass('opacity-100');
  });

  it('should have correct toggle position for light theme', () => {
    renderWithThemeProvider('light');
    
    const button = screen.getByRole('switch');
    const toggleCircle = button.querySelector('span');
    
    expect(toggleCircle).toHaveClass('translate-x-1');
  });

  it('should have correct toggle position for dark theme', () => {
    renderWithThemeProvider('dark');
    
    const button = screen.getByRole('switch');
    const toggleCircle = button.querySelector('span');
    
    expect(toggleCircle).toHaveClass('translate-x-6');
  });

  it('should have focus styles', () => {
    renderWithThemeProvider();
    
    const button = screen.getByRole('switch');
    expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');
  });

  it('should have hover styles', () => {
    renderWithThemeProvider();
    
    const button = screen.getByRole('switch');
    expect(button).toHaveClass('hover:bg-gray-300', 'dark:hover:bg-gray-600');
  });

  it('should have smooth transitions', () => {
    renderWithThemeProvider();
    
    const button = screen.getByRole('switch');
    const toggleCircle = button.querySelector('span');
    const sunIcon = button.querySelector('svg:first-of-type');
    const moonIcon = button.querySelector('svg:last-of-type');
    
    expect(button).toHaveClass('transition-colors', 'duration-300', 'ease-in-out');
    expect(toggleCircle).toHaveClass('transition-transform', 'duration-300', 'ease-in-out');
    expect(sunIcon).toHaveClass('transition-opacity', 'duration-300', 'ease-in-out');
    expect(moonIcon).toHaveClass('transition-opacity', 'duration-300', 'ease-in-out');
  });
});