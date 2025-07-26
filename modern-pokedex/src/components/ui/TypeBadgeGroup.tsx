import React from 'react';
import type { PokemonType } from '../../types/pokemon';
import { TypeBadge } from './TypeBadge';

interface TypeBadgeGroupProps {
  types: PokemonType[];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outlined';
  className?: string;
  maxTypes?: number;
}

export const TypeBadgeGroup: React.FC<TypeBadgeGroupProps> = ({
  types,
  size = 'md',
  variant = 'filled',
  className = '',
  maxTypes
}) => {
  const displayTypes = maxTypes ? types.slice(0, maxTypes) : types;
  const remainingCount = maxTypes && types.length > maxTypes ? types.length - maxTypes : 0;

  const gapClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3'
  };

  return (
    <div className={`flex flex-wrap items-center ${gapClasses[size]} ${className}`}>
      {displayTypes.map((type, index) => (
        <TypeBadge
          key={`${type.name}-${index}`}
          type={type}
          size={size}
          variant={variant}
        />
      ))}
      
      {remainingCount > 0 && (
        <span
          className={`
            inline-flex items-center justify-center
            font-medium rounded-full
            bg-gray-200 dark:bg-gray-700
            text-gray-600 dark:text-gray-300
            ${size === 'sm' ? 'px-2 py-1 text-xs' : ''}
            ${size === 'md' ? 'px-3 py-1.5 text-sm' : ''}
            ${size === 'lg' ? 'px-4 py-2 text-base' : ''}
          `}
          title={`+${remainingCount} more types`}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
};