import React from 'react';
import { useTranslation } from 'react-i18next';
import type { PokemonType } from '../../types/pokemon';
import { getTypeColor, getTypeTextColor } from '../../utils/typeColors';

interface TypeBadgeProps {
  type: PokemonType;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outlined';
  className?: string;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({
  type,
  size = 'md',
  variant = 'filled',
  className = ''
}) => {
  const { t } = useTranslation();

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const backgroundColor = getTypeColor(type.name);
  const textColor = getTypeTextColor(type.name);

  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-full
    transition-all duration-200 ease-in-out
    transform hover:scale-105
    shadow-sm hover:shadow-md
    ${sizeClasses[size]}
    ${className}
  `;

  const filledStyles = {
    backgroundColor,
    color: textColor,
    border: `2px solid ${backgroundColor}`
  };

  const outlinedStyles = {
    backgroundColor: 'transparent',
    color: backgroundColor,
    border: `2px solid ${backgroundColor}`
  };

  const styles = variant === 'filled' ? filledStyles : outlinedStyles;

  return (
    <span
      className={baseClasses}
      style={styles}
      title={t(`types.${type.name}`)}
      role="badge"
      aria-label={`Pokemon type: ${t(`types.${type.name}`)}`}
    >
      {t(`types.${type.name}`)}
    </span>
  );
};