import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Pokemon } from '../../types/pokemon';
import { TypeBadgeGroup } from '../ui/TypeBadgeGroup';
import { PokemonImage } from '../ui/OptimizedImage';
import { getLocalizedPokemonName } from '../../utils/localization';
import { getDualTypeGradient } from '../../utils/typeColors';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: (pokemon: Pokemon) => void;
  className?: string;
  showStats?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PokemonCard: React.FC<PokemonCardProps> = React.memo(({
  pokemon,
  onClick,
  className = '',
  showStats = false,
  size = 'md'
}) => {
  const { t, i18n } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const sizeClasses = {
    sm: {
      container: 'p-3',
      image: 'w-16 h-16',
      title: 'text-sm',
      subtitle: 'text-xs',
      badge: 'sm'
    },
    md: {
      container: 'p-4',
      image: 'w-24 h-24',
      title: 'text-lg',
      subtitle: 'text-sm',
      badge: 'sm'
    },
    lg: {
      container: 'p-6',
      image: 'w-32 h-32',
      title: 'text-xl',
      subtitle: 'text-base',
      badge: 'md'
    }
  };

  const localizedName = getLocalizedPokemonName(pokemon.name, i18n.language as 'en' | 'th');
  const backgroundGradient = pokemon.types.length > 1 
    ? getDualTypeGradient(pokemon.types[0].name, pokemon.types[1].name)
    : `linear-gradient(135deg, ${pokemon.types[0].color} 0%, ${pokemon.types[0].color} 100%)`;

  const handleClick = () => {
    if (onClick) {
      onClick(pokemon);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const renderImage = () => {
    const imageSizes = {
      sm: { width: 64, height: 64 },
      md: { width: 96, height: 96 },
      lg: { width: 128, height: 128 }
    };

    return (
      <PokemonImage
        pokemonId={pokemon.id}
        pokemonName={pokemon.name}
        alt={localizedName}
        width={imageSizes[size].width}
        height={imageSizes[size].height}
        className={`${sizeClasses[size].image} object-contain transition-transform duration-200 group-hover:scale-110`}
        lazy={true}
        priority={false}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    );
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl shadow-md hover:shadow-xl
        transition-all duration-300 ease-in-out
        transform hover:scale-105 hover:-translate-y-1
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
      aria-label={onClick ? `View details for ${localizedName}` : undefined}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ background: backgroundGradient }}
      />

      {/* Card content */}
      <div className={`relative ${sizeClasses[size].container}`}>
        {/* Header with dex number */}
        <div className="flex justify-between items-start mb-3">
          <span className={`${sizeClasses[size].subtitle} font-mono text-gray-500 dark:text-gray-400`}>
            {pokemon.dexNumber}
          </span>
          {pokemon.isLegendary && (
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          )}
        </div>

        {/* Pokemon image */}
        <div className="flex justify-center mb-4">
          {renderImage()}
        </div>

        {/* Pokemon name */}
        <h3 className={`${sizeClasses[size].title} font-bold text-gray-900 dark:text-white text-center mb-2 truncate`}>
          {localizedName}
        </h3>

        {/* Pokemon types */}
        <div className="flex justify-center mb-3">
          <TypeBadgeGroup
            types={pokemon.types}
            size={sizeClasses[size].badge as 'sm' | 'md'}
            maxTypes={2}
          />
        </div>

        {/* Optional stats */}
        {showStats && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className={`${sizeClasses[size].subtitle} text-gray-500 dark:text-gray-400`}>
                  {t('stats.hp')}
                </div>
                <div className={`${sizeClasses[size].subtitle} font-semibold text-gray-900 dark:text-white`}>
                  {pokemon.stats.hp}
                </div>
              </div>
              <div>
                <div className={`${sizeClasses[size].subtitle} text-gray-500 dark:text-gray-400`}>
                  {t('stats.attack')}
                </div>
                <div className={`${sizeClasses[size].subtitle} font-semibold text-gray-900 dark:text-white`}>
                  {pokemon.stats.attack}
                </div>
              </div>
              <div>
                <div className={`${sizeClasses[size].subtitle} text-gray-500 dark:text-gray-400`}>
                  {t('stats.defense')}
                </div>
                <div className={`${sizeClasses[size].subtitle} font-semibold text-gray-900 dark:text-white`}>
                  {pokemon.stats.defense}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hover overlay */}
      {onClick && (
        <div className="absolute inset-0 bg-black opacity-0 hover:opacity-5 transition-opacity duration-200 pointer-events-none" />
      )}
    </div>
  );
});