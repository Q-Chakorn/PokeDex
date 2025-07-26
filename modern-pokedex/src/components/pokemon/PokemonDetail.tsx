import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Pokemon } from '../../types/pokemon';
import { TypeBadgeGroup } from '../ui/TypeBadgeGroup';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { PokemonImage } from '../ui/OptimizedImage';
import { PokemonStats } from './PokemonStats';

interface PokemonDetailProps {
  pokemon?: Pokemon;
  loading?: boolean;
  error?: Error | string | null;
  onBack?: () => void;
  className?: string;
  showBackButton?: boolean;
}

export const PokemonDetail: React.FC<PokemonDetailProps> = ({
  pokemon,
  loading = false,
  error = null,
  onBack,
  className = '',
  showBackButton = true
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`py-8 ${className}`}>
        <ErrorMessage
          error={error}
          onRetry={onBack}
          showRetryButton={!!onBack}
        />
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className={`py-8 ${className}`}>
        <ErrorMessage
          error={t('error.pokemonNotFound')}
          onRetry={onBack}
          showRetryButton={!!onBack}
        />
      </div>
    );
  }

  const formatHeight = (height: number) => {
    const meters = height / 10;
    return `${meters.toFixed(1)} ${t('units.meters')}`;
  };

  const formatWeight = (weight: number) => {
    const kilograms = weight / 10;
    return `${kilograms.toFixed(1)} ${t('units.kilograms')}`;
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Back Button */}
      {showBackButton && onBack && (
        <button
          onClick={onBack}
          className="
            inline-flex items-center mb-6 px-4 py-2
            text-sm font-medium text-gray-600 dark:text-gray-400
            hover:text-gray-800 dark:hover:text-gray-200
            bg-white dark:bg-gray-800
            border border-gray-300 dark:border-gray-600
            rounded-lg
            hover:bg-gray-50 dark:hover:bg-gray-700
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          "
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t('pokemon.backToList')}
        </button>
      )}

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 px-6 py-8">
          {/* Pokemon Number */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
              {t('pokemon.number', { number: pokemon.id.toString().padStart(3, '0') })}
            </span>
          </div>

          {/* Pokemon Name and Image */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Pokemon Image */}
            <div className="relative">
              <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <PokemonImage
                  pokemonId={pokemon.id}
                  pokemonName={pokemon.name}
                  alt={pokemon.name}
                  width={160}
                  height={160}
                  className="w-40 h-40 object-contain drop-shadow-lg"
                  priority={true}
                  lazy={false}
                />
              </div>
            </div>

            {/* Pokemon Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 capitalize">
                {pokemon.name}
              </h1>
              
              {/* Types */}
              <div className="mb-4">
                <TypeBadgeGroup
                  types={pokemon.types}
                  size="lg"
                  className="justify-center md:justify-start"
                />
              </div>

              {/* Basic Stats */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto md:mx-0">
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-white/80 text-sm font-medium">
                    {t('pokemon.height')}
                  </div>
                  <div className="text-white text-lg font-bold">
                    {formatHeight(pokemon.height)}
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-white/80 text-sm font-medium">
                    {t('pokemon.weight')}
                  </div>
                  <div className="text-white text-lg font-bold">
                    {formatWeight(pokemon.weight)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Description */}
              {pokemon.description && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('pokemon.description')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {pokemon.description}
                  </p>
                </div>
              )}

              {/* Abilities */}
              {pokemon.abilities && pokemon.abilities.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('pokemon.abilities')}
                  </h2>
                  <div className="space-y-2">
                    {pokemon.abilities.map((ability, index) => (
                      <div
                        key={index}
                        className="
                          inline-flex items-center px-3 py-2 mr-2 mb-2
                          bg-gray-100 dark:bg-gray-700
                          text-gray-800 dark:text-gray-200
                          rounded-lg text-sm font-medium
                          border border-gray-200 dark:border-gray-600
                        "
                      >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {ability.name}
                        {ability.isHidden && (
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            (Hidden)
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Stats */}
              {pokemon.stats && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {t('pokemon.stats')}
                  </h2>
                  <PokemonStats stats={pokemon.stats} variant="default" />
                </div>
              )}

              {/* Additional Info */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Details
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      {t('pokemon.number')}
                    </span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      #{pokemon.id.toString().padStart(3, '0')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      {t('pokemon.types')}
                    </span>
                    <div>
                      <TypeBadgeGroup types={pokemon.types} size="sm" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      {t('pokemon.height')}
                    </span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {formatHeight(pokemon.height)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      {t('pokemon.weight')}
                    </span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {formatWeight(pokemon.weight)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Generation Info */}
              {pokemon.generation && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Generation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Generation {pokemon.generation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};