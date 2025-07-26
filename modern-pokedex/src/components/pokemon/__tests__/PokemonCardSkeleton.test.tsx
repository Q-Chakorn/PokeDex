import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PokemonCardSkeleton } from '../PokemonCardSkeleton';

describe('PokemonCardSkeleton', () => {
  it('should render skeleton with default props', () => {
    const { container } = render(<PokemonCardSkeleton />);

    expect(container.firstChild).toHaveClass('animate-pulse');
    expect(container.firstChild).toHaveClass('rounded-xl', 'shadow-md');
  });

  it('should apply small size classes', () => {
    render(<PokemonCardSkeleton size="sm" />);

    const container = screen.getByRole('generic');
    expect(container.querySelector('.p-3')).toBeInTheDocument();
    expect(container.querySelector('.w-16.h-16')).toBeInTheDocument();
  });

  it('should apply medium size classes (default)', () => {
    render(<PokemonCardSkeleton />);

    const container = screen.getByRole('generic');
    expect(container.querySelector('.p-4')).toBeInTheDocument();
    expect(container.querySelector('.w-24.h-24')).toBeInTheDocument();
  });

  it('should apply large size classes', () => {
    render(<PokemonCardSkeleton size="lg" />);

    const container = screen.getByRole('generic');
    expect(container.querySelector('.p-6')).toBeInTheDocument();
    expect(container.querySelector('.w-32.h-32')).toBeInTheDocument();
  });

  it('should show stats skeleton when showStats is true', () => {
    render(<PokemonCardSkeleton showStats />);

    const statsContainer = screen.getByRole('generic').querySelector('.grid.grid-cols-3');
    expect(statsContainer).toBeInTheDocument();
    
    const statItems = statsContainer?.querySelectorAll('.text-center');
    expect(statItems).toHaveLength(3);
  });

  it('should not show stats skeleton when showStats is false (default)', () => {
    render(<PokemonCardSkeleton />);

    const statsContainer = screen.getByRole('generic').querySelector('.grid.grid-cols-3');
    expect(statsContainer).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<PokemonCardSkeleton className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should have proper skeleton structure', () => {
    render(<PokemonCardSkeleton />);

    const container = screen.getByRole('generic');
    
    // Header skeleton (dex number and legendary icon)
    expect(container.querySelector('.flex.justify-between.items-start')).toBeInTheDocument();
    
    // Image skeleton
    expect(container.querySelector('.flex.justify-center')).toBeInTheDocument();
    
    // Type badges skeleton
    expect(container.querySelector('.flex.justify-center.gap-2')).toBeInTheDocument();
  });

  it('should have dark mode support', () => {
    const { container } = render(<PokemonCardSkeleton />);

    expect(container.firstChild).toHaveClass('bg-white', 'dark:bg-gray-800');
    expect(container.firstChild).toHaveClass('border-gray-200', 'dark:border-gray-700');
  });

  it('should render skeleton elements with proper background colors', () => {
    render(<PokemonCardSkeleton />);

    const container = screen.getByRole('generic');
    const skeletonElements = container.querySelectorAll('.bg-gray-200.dark\\:bg-gray-700');
    
    // Should have multiple skeleton elements
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('should have proper border and shadow styling', () => {
    const { container } = render(<PokemonCardSkeleton />);

    expect(container.firstChild).toHaveClass(
      'border',
      'border-gray-200',
      'dark:border-gray-700',
      'shadow-md'
    );
  });

  it('should render type badge skeletons', () => {
    render(<PokemonCardSkeleton />);

    const container = screen.getByRole('generic');
    const badgeSkeletons = container.querySelectorAll('.rounded-full');
    
    // Should have 2 type badge skeletons
    expect(badgeSkeletons).toHaveLength(2);
  });
});