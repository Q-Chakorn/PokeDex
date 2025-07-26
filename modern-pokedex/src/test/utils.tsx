import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../contexts/AppContext';

// Mock data
export const mockPokemon = {
  id: 25,
  name: 'pikachu',
  types: ['electric'],
  stats: {
    hp: 35,
    attack: 55,
    defense: 40,
    specialAttack: 50,
    specialDefense: 50,
    speed: 90,
  },
  abilities: [
    { name: 'static', isHidden: false },
    { name: 'lightning-rod', isHidden: true },
  ],
  moves: [
    { name: 'thunder-shock', level: 1 },
    { name: 'tail-whip', level: 1 },
  ],
  height: 4,
  weight: 60,
  baseExperience: 112,
};

export const mockPokemonList = [
  mockPokemon,
  {
    id: 1,
    name: 'bulbasaur',
    types: ['grass', 'poison'],
    stats: {
      hp: 45,
      attack: 49,
      defense: 49,
      specialAttack: 65,
      specialDefense: 65,
      speed: 45,
    },
    abilities: [
      { name: 'overgrow', isHidden: false },
      { name: 'chlorophyll', isHidden: true },
    ],
    moves: [
      { name: 'tackle', level: 1 },
      { name: 'growl', level: 1 },
    ],
    height: 7,
    weight: 69,
    baseExperience: 64,
  },
  {
    id: 4,
    name: 'charmander',
    types: ['fire'],
    stats: {
      hp: 39,
      attack: 52,
      defense: 43,
      specialAttack: 60,
      specialDefense: 50,
      speed: 65,
    },
    abilities: [
      { name: 'blaze', isHidden: false },
      { name: 'solar-power', isHidden: true },
    ],
    moves: [
      { name: 'scratch', level: 1 },
      { name: 'growl', level: 1 },
    ],
    height: 6,
    weight: 85,
    baseExperience: 62,
  },
];

// Test wrapper component
interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <AppProvider>
        {children}
      </AppProvider>
    </BrowserRouter>
  );
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Custom matchers
export const expectToBeInTheDocument = (element: HTMLElement | null) => {
  expect(element).toBeInTheDocument();
};

export const expectToHaveClass = (element: HTMLElement | null, className: string) => {
  expect(element).toHaveClass(className);
};

export const expectToHaveAttribute = (
  element: HTMLElement | null,
  attribute: string,
  value?: string
) => {
  if (value !== undefined) {
    expect(element).toHaveAttribute(attribute, value);
  } else {
    expect(element).toHaveAttribute(attribute);
  }
};

// Test helpers
export const createMockIntersectionObserver = () => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
  window.IntersectionObserverEntry = vi.fn();
};

export const createMockResizeObserver = () => {
  const mockResizeObserver = vi.fn();
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.ResizeObserver = mockResizeObserver;
};

export const mockLocalStorage = () => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
  return localStorageMock;
};

export const mockSessionStorage = () => {
  const sessionStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
  });
  return sessionStorageMock;
};

// API mocking helpers
export const mockFetch = (data: any, ok = true, status = 200) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });
};

export const mockFetchError = (error: string) => {
  global.fetch = vi.fn().mockRejectedValue(new Error(error));
};

// Performance testing helpers
export const measureRenderTime = async (renderFn: () => void) => {
  const start = performance.now();
  renderFn();
  const end = performance.now();
  return end - start;
};

// Accessibility testing helpers
export const checkAccessibility = async (container: HTMLElement) => {
  // Basic accessibility checks
  const images = container.querySelectorAll('img');
  images.forEach((img) => {
    expect(img).toHaveAttribute('alt');
  });

  const buttons = container.querySelectorAll('button');
  buttons.forEach((button) => {
    const hasAriaLabel = button.hasAttribute('aria-label');
    const hasAriaLabelledBy = button.hasAttribute('aria-labelledby');
    const hasTextContent = button.textContent?.trim().length > 0;
    
    expect(hasAriaLabel || hasAriaLabelledBy || hasTextContent).toBe(true);
  });

  const inputs = container.querySelectorAll('input');
  inputs.forEach((input) => {
    const hasAriaLabel = input.hasAttribute('aria-label');
    const hasAriaLabelledBy = input.hasAttribute('aria-labelledby');
    const hasLabel = container.querySelector(`label[for="${input.id}"]`);
    
    expect(hasAriaLabel || hasAriaLabelledBy || hasLabel).toBeTruthy();
  });
};

// Wait utilities
export const waitForElement = async (selector: string, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
};

// Test data generators
export const generatePokemon = (overrides: Partial<typeof mockPokemon> = {}) => ({
  ...mockPokemon,
  ...overrides,
});

export const generatePokemonList = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    ...mockPokemon,
    id: index + 1,
    name: `pokemon-${index + 1}`,
  }));
};

// Error boundary testing
export const ThrowError: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Custom hooks testing
export const renderHookWithProviders = <T,>(hook: () => T) => {
  return renderHook(hook, {
    wrapper: AllTheProviders,
  });
};

// Form testing helpers
export const fillForm = async (form: HTMLFormElement, data: Record<string, string>) => {
  for (const [name, value] of Object.entries(data)) {
    const input = form.querySelector(`[name="${name}"]`) as HTMLInputElement;
    if (input) {
      fireEvent.change(input, { target: { value } });
    }
  }
};

export const submitForm = (form: HTMLFormElement) => {
  fireEvent.submit(form);
};

// Animation testing
export const mockAnimations = () => {
  // Mock requestAnimationFrame
  global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16));
  global.cancelAnimationFrame = vi.fn();

  // Mock CSS animations
  Element.prototype.animate = vi.fn().mockReturnValue({
    finished: Promise.resolve(),
    cancel: vi.fn(),
    pause: vi.fn(),
    play: vi.fn(),
  });
};

// Cleanup utilities
export const cleanup = () => {
  vi.clearAllMocks();
  vi.resetAllMocks();
  localStorage.clear();
  sessionStorage.clear();
};