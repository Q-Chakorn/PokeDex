import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { TypeBadgeGroup } from '../TypeBadgeGroup';
import type { PokemonType } from '../../../types/pokemon';

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

const renderWithI18n = (component: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  );
};

const mockTypes: PokemonType[] = [
  { name: 'fire', color: '#F08030' },
  { name: 'water', color: '#6890F0' },
  { name: 'grass', color: '#78C850' },
  { name: 'electric', color: '#F8D030' }
];

describe('TypeBadgeGroup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render all types when no maxTypes is set', () => {
    renderWithI18n(<TypeBadgeGroup types={mockTypes} />);

    expect(screen.getByText('Fire')).toBeInTheDocument();
    expect(screen.getByText('Water')).toBeInTheDocument();
    expect(screen.getByText('Grass')).toBeInTheDocument();
    expect(screen.getByText('Electric')).toBeInTheDocument();
  });

  it('should limit types when maxTypes is set', () => {
    renderWithI18n(<TypeBadgeGroup types={mockTypes} maxTypes={2} />);

    expect(screen.getByText('Fire')).toBeInTheDocument();
    expect(screen.getByText('Water')).toBeInTheDocument();
    expect(screen.queryByText('Grass')).not.toBeInTheDocument();
    expect(screen.queryByText('Electric')).not.toBeInTheDocument();
  });

  it('should show remaining count when maxTypes is exceeded', () => {
    renderWithI18n(<TypeBadgeGroup types={mockTypes} maxTypes={2} />);

    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.getByTitle('+2 more types')).toBeInTheDocument();
  });

  it('should not show remaining count when types length equals maxTypes', () => {
    renderWithI18n(<TypeBadgeGroup types={mockTypes.slice(0, 2)} maxTypes={2} />);

    expect(screen.queryByText('+0')).not.toBeInTheDocument();
  });

  it('should apply small size gap classes', () => {
    const { container } = renderWithI18n(<TypeBadgeGroup types={mockTypes.slice(0, 2)} size="sm" />);

    const groupContainer = container.firstChild;
    expect(groupContainer).toHaveClass('gap-1');
  });

  it('should apply medium size gap classes (default)', () => {
    const { container } = renderWithI18n(<TypeBadgeGroup types={mockTypes.slice(0, 2)} />);

    const groupContainer = container.firstChild;
    expect(groupContainer).toHaveClass('gap-2');
  });

  it('should apply large size gap classes', () => {
    const { container } = renderWithI18n(<TypeBadgeGroup types={mockTypes.slice(0, 2)} size="lg" />);

    const groupContainer = container.firstChild;
    expect(groupContainer).toHaveClass('gap-3');
  });

  it('should pass size prop to TypeBadge components', () => {
    renderWithI18n(<TypeBadgeGroup types={mockTypes.slice(0, 1)} size="lg" />);

    const badge = screen.getByRole('badge');
    expect(badge).toHaveClass('px-4', 'py-2', 'text-base');
  });

  it('should pass variant prop to TypeBadge components', () => {
    renderWithI18n(<TypeBadgeGroup types={mockTypes.slice(0, 1)} variant="outlined" />);

    const badge = screen.getByRole('badge');
    expect(badge).toHaveStyle({
      backgroundColor: 'transparent',
      color: '#F08030'
    });
  });

  it('should apply custom className', () => {
    const { container } = renderWithI18n(
      <TypeBadgeGroup types={mockTypes.slice(0, 2)} className="custom-class" />
    );

    const groupContainer = container.firstChild;
    expect(groupContainer).toHaveClass('custom-class');
  });

  it('should have proper flex layout classes', () => {
    const { container } = renderWithI18n(<TypeBadgeGroup types={mockTypes.slice(0, 2)} />);

    const groupContainer = container.firstChild;
    expect(groupContainer).toHaveClass('flex', 'flex-wrap', 'items-center');
  });

  it('should handle empty types array', () => {
    const { container } = renderWithI18n(<TypeBadgeGroup types={[]} />);

    const groupContainer = container.firstChild;
    expect(groupContainer).toBeEmptyDOMElement();
  });

  it('should handle single type', () => {
    renderWithI18n(<TypeBadgeGroup types={[mockTypes[0]]} />);

    expect(screen.getByText('Fire')).toBeInTheDocument();
    expect(screen.getAllByRole('badge')).toHaveLength(1);
  });

  it('should generate unique keys for duplicate type names', () => {
    const duplicateTypes = [mockTypes[0], mockTypes[0]];
    
    renderWithI18n(<TypeBadgeGroup types={duplicateTypes} />);

    expect(screen.getAllByText('Fire')).toHaveLength(2);
    expect(screen.getAllByRole('badge')).toHaveLength(2);
  });
});