import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { EmptyState, NoResultsState, NoPokemonState } from '../EmptyState';

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

describe('EmptyState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render with default props', () => {
    renderWithI18n(<EmptyState />);

    expect(screen.getByText('No Pokémon found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search terms or filters')).toBeInTheDocument();
  });

  it('should render with custom title and description', () => {
    const title = 'Custom Title';
    const description = 'Custom description';

    renderWithI18n(<EmptyState title={title} description={description} />);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('should render custom icon', () => {
    const customIcon = <div data-testid="custom-icon">Custom Icon</div>;

    renderWithI18n(<EmptyState icon={customIcon} />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('should render default icon when no custom icon provided', () => {
    renderWithI18n(<EmptyState />);

    const defaultIcon = screen.getByRole('heading').parentElement?.previousElementSibling?.querySelector('svg');
    expect(defaultIcon).toBeInTheDocument();
  });

  it('should render action button when action is provided', () => {
    const action = {
      label: 'Custom Action',
      onClick: vi.fn()
    };

    renderWithI18n(<EmptyState action={action} />);

    const actionButton = screen.getByText('Custom Action');
    expect(actionButton).toBeInTheDocument();

    fireEvent.click(actionButton);
    expect(action.onClick).toHaveBeenCalledTimes(1);
  });

  it('should not render action button when no action provided', () => {
    renderWithI18n(<EmptyState />);

    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });

  it('should apply custom className', () => {
    const { container } = renderWithI18n(<EmptyState className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should have proper text center alignment', () => {
    const { container } = renderWithI18n(<EmptyState />);

    expect(container.firstChild).toHaveClass('text-center');
  });

  it('should have proper spacing classes', () => {
    const { container } = renderWithI18n(<EmptyState />);

    expect(container.firstChild).toHaveClass('py-12', 'px-6');
  });
});

describe('NoResultsState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render with default content', () => {
    renderWithI18n(<NoResultsState />);

    expect(screen.getByText('No Pokémon found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search terms or filters')).toBeInTheDocument();
  });

  it('should render clear filters button when onClearFilters is provided', () => {
    const onClearFilters = vi.fn();

    renderWithI18n(<NoResultsState onClearFilters={onClearFilters} />);

    const clearButton = screen.getByText('Clear all filters');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });

  it('should not render clear filters button when onClearFilters is not provided', () => {
    renderWithI18n(<NoResultsState />);

    expect(screen.queryByText('Clear all filters')).not.toBeInTheDocument();
  });

  it('should render search icon', () => {
    renderWithI18n(<NoResultsState />);

    const icon = screen.getByRole('heading').parentElement?.previousElementSibling?.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});

describe('NoPokemonState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render with default content', () => {
    renderWithI18n(<NoPokemonState />);

    expect(screen.getByText('No Pokémon Found')).toBeInTheDocument();
    expect(screen.getByText('We couldn\'t find any Pokémon. This might be a temporary issue.')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const onRetry = vi.fn();

    renderWithI18n(<NoPokemonState onRetry={onRetry} />);

    const retryButton = screen.getByText('Try again');
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should not render retry button when onRetry is not provided', () => {
    renderWithI18n(<NoPokemonState />);

    expect(screen.queryByText('Try again')).not.toBeInTheDocument();
  });

  it('should render pokeball icon', () => {
    renderWithI18n(<NoPokemonState />);

    // Check for pokeball structure elements
    const iconContainer = screen.getByRole('heading').parentElement?.previousElementSibling;
    expect(iconContainer?.querySelector('.bg-red-500')).toBeInTheDocument();
    expect(iconContainer?.querySelector('.bg-white')).toBeInTheDocument();
  });

  it('should have pokeball styling with opacity', () => {
    renderWithI18n(<NoPokemonState />);

    const iconContainer = screen.getByRole('heading').parentElement?.previousElementSibling;
    const pokeball = iconContainer?.querySelector('.opacity-50');
    expect(pokeball).toBeInTheDocument();
  });
});