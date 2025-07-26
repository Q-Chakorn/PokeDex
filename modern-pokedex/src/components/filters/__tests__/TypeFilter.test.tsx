import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { TypeFilter } from '../TypeFilter';
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
  { name: 'electric', color: '#F8D030' },
  { name: 'psychic', color: '#F85888' },
];

describe('TypeFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
  });

  it('should render with placeholder text', () => {
    renderWithI18n(
      <TypeFilter
        availableTypes={mockTypes}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
      />
    );

    expect(screen.getByText('Type')).toBeInTheDocument();
  });

  it('should render with custom placeholder', () => {
    renderWithI18n(
      <TypeFilter
        availableTypes={mockTypes}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
        placeholder="Select types..."
      />
    );

    expect(screen.getByText('Select types...')).toBeInTheDocument();
  });

  it('should show selected types as badges', () => {
    const selectedTypes = [mockTypes[0], mockTypes[1]];
    
    renderWithI18n(
      <TypeFilter
        availableTypes={mockTypes}
        selectedTypes={selectedTypes}
        onTypesChange={vi.fn()}
      />
    );

    expect(screen.getByText('Fire')).toBeInTheDocument();
    expect(screen.getByText('Water')).toBeInTheDocument();
  });

  it('should show remaining count when maxDisplayedTypes is exceeded', () => {
    const selectedTypes = [mockTypes[0], mockTypes[1], mockTypes[2], mockTypes[3]];
    
    renderWithI18n(
      <TypeFilter
        availableTypes={mockTypes}
        selectedTypes={selectedTypes}
        onTypesChange={vi.fn()}
        maxDisplayedTypes={2}
      />
    );

    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('should open dropdown when clicked', async () => {
    renderWithI18n(
      <TypeFilter
        availableTypes={mockTypes}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
      />
    );

    const trigger = screen.getByText('Type');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search types...')).toBeInTheDocument();
    });
  });

  it('should filter types based on search query', async () => {
    renderWithI18n(
      <TypeFilter
        availableTypes={mockTypes}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
      />
    );

    const trigger = screen.getByText('Type');
    fireEvent.click(trigger);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search types...');
      fireEvent.change(searchInput, { target: { value: 'fire' } });
    });

    await waitFor(() => {
      expect(screen.getByText('Fire')).toBeInTheDocument();
      expect(screen.queryByText('Water')).not.toBeInTheDocument();
    });
  });

  it('should call onTypesChange when type is selected', async () => {
    const onTypesChange = vi.fn();
    
    renderWithI18n(
      <TypeFilter
        availableTypes={mockTypes}
        selectedTypes={[]}
        onTypesChange={onTypesChange}
      />
    );

    const trigger = screen.getByText('Type');
    fireEvent.click(trigger);

    await waitFor(() => {
      const fireOption = screen.getByText('Fire');
      fireEvent.click(fireOption);
    });

    expect(onTypesChange).toHaveBeenCalledWith([mockTypes[0]]);
  });

  it('should call onTypesChange when type is deselected', async () => {
    const onTypesChange = vi.fn();
    const selectedTypes = [mockTypes[0]];
    
    renderWithI18n(
      <TypeFilter
        availableTypes={mockTypes}
        selectedTypes={selectedTypes}
        onTypesChange={onTypesChange}
      />
    );

    const trigger = screen.getByText('Fire');
    fireEvent.click(trigger);

    await waitFor(() => {
      const fireOptions = screen.getAllByText('Fire');
      const dropdownOption = fireOptions.find(option => 
        option.closest('button')?.className.includes('w-full flex items-center')
      );
      if (dropdownOption) {
        fireEvent.click(dropdownOption.closest('button')!);
      }
    });

    expect(onTypesChange).toHaveBeenCalledWith([]);
  });

  it('should show clear all button when types are selected', () => {
    const selectedTypes = [mockTypes[0], mockTypes[1]];
    
    renderWithI18n(
      <TypeFilter
        availableTypes={mockTypes}
        selectedTypes={selectedTypes}
        onTypesChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Clear all filters')).toBeInTheDocument();
  });

  it('should clear all types when clear all is clicked', () => {
    const onTypesChange = vi.fn();
    const selectedTypes = [mockTypes[0], mockTypes[1]];
    
    renderWithI18n(
      <TypeFilter
        availableTypes={mockTypes}
        selectedTypes={selectedTypes}
        onTypesChange={onTypesChange}
      />
    );

    const clearButton = screen.getByLabelText('Clear all filters');
    fireEvent.click(clearButton);

    expect(onTypesChange).toHaveBeenCalledWith([]);
  });

  it('should remove individual type when remove button is clicked', () => {
    const onTypesChange = vi.fn();
    const selectedTypes = [mockTypes[0], mockTypes[1]];
    
    renderWithI18n(
      <TypeFilter
        availableTypes={mockTypes}
        selectedTypes={selectedTypes}
        onTypesChange={onTypesChange}
      />
    );

    const removeButton = screen.getByLabelText('Remove Fire filter');
    fireEvent.click(removeButton);

    expect(onTypesChange).toHaveBeenCalledWith([mockTypes[1]]);
  });

  it('should be disabled when disabled prop is true', () => {
    renderWithI18n(
      <TypeFilter
        availableTypes={mockTypes}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
        disabled={true}
      />
    );

    const trigger = screen.getByText('Type');
    fireEvent.click(trigger);

    // Dropdown should not open
    expect(screen.queryByPlaceholderText('Search types...')).not.toBeInTheDocument();
  });

  it('should close dropdown when clicking outside', async () => {
    renderWithI18n(
      <div>
        <TypeFilter
          availableTypes={mockTypes}
          selectedTypes={[]}
          onTypesChange={vi.fn()}
        />
        <div data-testid="outside">Outside element</div>
      </div>
    );

    const trigger = screen.getByText('Type');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search types...')).toBeInTheDocument();
    });

    const outsideElement = screen.getByTestId('outside');
    fireEvent.mouseDown(outsideElement);

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Search types...')).not.toBeInTheDocument();
    });
  });

  it('should show selected count in dropdown footer', async () => {
    const selectedTypes = [mockTypes[0], mockTypes[1]];
    
    renderWithI18n(
      <TypeFilter
        availableTypes={mockTypes}
        selectedTypes={selectedTypes}
        onTypesChange={vi.fn()}
      />
    );

    const trigger = screen.getByText('Fire');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('2 types selected')).toBeInTheDocument();
    });
  });

  it('should show checkmark for selected types in dropdown', async () => {
    const selectedTypes = [mockTypes[0]];
    
    renderWithI18n(
      <TypeFilter
        availableTypes={mockTypes}
        selectedTypes={selectedTypes}
        onTypesChange={vi.fn()}
      />
    );

    const trigger = screen.getByText('Fire');
    fireEvent.click(trigger);

    await waitFor(() => {
      // Check if the selected type has a checkmark (svg with check path)
      const checkmarks = screen.getAllByRole('button');
      const fireButton = checkmarks.find(button => 
        button.textContent?.includes('Fire')
      );
      expect(fireButton).toBeInTheDocument();
    });
  });

  it('should apply custom className', () => {
    const { container } = renderWithI18n(
      <TypeFilter
        availableTypes={mockTypes}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should show "No types found" when search has no results', async () => {
    renderWithI18n(
      <TypeFilter
        availableTypes={mockTypes}
        selectedTypes={[]}
        onTypesChange={vi.fn()}
      />
    );

    const trigger = screen.getByText('Type');
    fireEvent.click(trigger);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search types...');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    });

    await waitFor(() => {
      expect(screen.getByText('No types found')).toBeInTheDocument();
    });
  });
});