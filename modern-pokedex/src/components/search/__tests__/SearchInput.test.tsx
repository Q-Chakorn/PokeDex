import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { SearchInput } from '../SearchInput';

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

describe('SearchInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render search input with default props', () => {
    renderWithI18n(<SearchInput />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search Pokémon by name or number...');
  });

  it('should render with custom placeholder', () => {
    const placeholder = 'Custom placeholder';
    renderWithI18n(<SearchInput placeholder={placeholder} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', placeholder);
  });

  it('should render with initial value', () => {
    renderWithI18n(<SearchInput value="Pikachu" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('Pikachu');
  });

  it('should call onChange when input value changes', () => {
    const onChange = vi.fn();
    renderWithI18n(<SearchInput onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Pikachu' } });

    expect(onChange).toHaveBeenCalledWith('Pikachu');
  });

  it('should debounce onSearch calls', async () => {
    const onSearch = vi.fn();
    renderWithI18n(<SearchInput onSearch={onSearch} debounceMs={300} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Pika' } });
    fireEvent.change(input, { target: { value: 'Pikachu' } });

    // Should not call onSearch immediately
    expect(onSearch).not.toHaveBeenCalled();

    // Fast-forward time
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('Pikachu');
      expect(onSearch).toHaveBeenCalledTimes(1);
    });
  });

  it('should call onSearch immediately on Enter key press', () => {
    const onSearch = vi.fn();
    renderWithI18n(<SearchInput onSearch={onSearch} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Pikachu' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSearch).toHaveBeenCalledWith('Pikachu');
  });

  it('should clear input on Escape key press', () => {
    const onChange = vi.fn();
    const onSearch = vi.fn();
    renderWithI18n(<SearchInput value="Pikachu" onChange={onChange} onSearch={onSearch} />);

    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(onChange).toHaveBeenCalledWith('');
    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('should show search icon by default', () => {
    renderWithI18n(<SearchInput />);

    const searchIcon = screen.getByRole('textbox').parentElement?.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });

  it('should hide search icon when showSearchIcon is false', () => {
    renderWithI18n(<SearchInput showSearchIcon={false} />);

    const searchIcon = screen.getByRole('textbox').parentElement?.querySelector('svg');
    expect(searchIcon).not.toBeInTheDocument();
  });

  it('should show clear button when there is value', () => {
    renderWithI18n(<SearchInput value="Pikachu" />);

    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  it('should not show clear button when showClearButton is false', () => {
    renderWithI18n(<SearchInput value="Pikachu" showClearButton={false} />);

    const clearButton = screen.queryByLabelText('Clear search');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should clear input when clear button is clicked', () => {
    const onChange = vi.fn();
    const onSearch = vi.fn();
    renderWithI18n(<SearchInput value="Pikachu" onChange={onChange} onSearch={onSearch} />);

    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);

    expect(onChange).toHaveBeenCalledWith('');
    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('should apply small size classes', () => {
    renderWithI18n(<SearchInput size="sm" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('text-sm', 'px-8', 'py-1');
  });

  it('should apply medium size classes (default)', () => {
    renderWithI18n(<SearchInput />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('text-base', 'px-10', 'py-2');
  });

  it('should apply large size classes', () => {
    renderWithI18n(<SearchInput size="lg" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('text-lg', 'px-12', 'py-3');
  });

  it('should be disabled when disabled prop is true', () => {
    renderWithI18n(<SearchInput disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('should apply custom className', () => {
    const { container } = renderWithI18n(<SearchInput className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should focus input when autoFocus is true', () => {
    renderWithI18n(<SearchInput autoFocus />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveFocus();
  });

  it('should have proper accessibility attributes', () => {
    renderWithI18n(<SearchInput />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-label', 'Search Pokémon by name or number...');
  });

  it('should show focus ring when focused', () => {
    renderWithI18n(<SearchInput />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);

    expect(input).toHaveClass('ring-2', 'ring-blue-500', 'border-transparent');
  });

  it('should update internal state when external value changes', () => {
    const { rerender } = renderWithI18n(<SearchInput value="Pikachu" />);

    let input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('Pikachu');

    rerender(
      <I18nextProvider i18n={i18n}>
        <SearchInput value="Charizard" />
      </I18nextProvider>
    );

    input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('Charizard');
  });

  it('should focus input after clearing', () => {
    renderWithI18n(<SearchInput value="Pikachu" />);

    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);

    const input = screen.getByRole('textbox');
    expect(input).toHaveFocus();
  });
});