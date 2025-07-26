import React from 'react';

interface PokemonCardSkeletonProps {
  size?: 'sm' | 'md' | 'lg';
  showStats?: boolean;
  className?: string;
}

export const PokemonCardSkeleton: React.FC<PokemonCardSkeletonProps> = ({
  size = 'md',
  showStats = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: {
      container: 'p-3',
      image: 'w-16 h-16',
      title: 'h-4',
      subtitle: 'h-3',
      badge: 'h-5 w-12'
    },
    md: {
      container: 'p-4',
      image: 'w-24 h-24',
      title: 'h-5',
      subtitle: 'h-3',
      badge: 'h-6 w-16'
    },
    lg: {
      container: 'p-6',
      image: 'w-32 h-32',
      title: 'h-6',
      subtitle: 'h-4',
      badge: 'h-7 w-20'
    }
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl shadow-md
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        animate-pulse
        ${className}
      `}
    >
      <div className={`relative ${sizeClasses[size].container}`}>
        {/* Header skeleton */}
        <div className="flex justify-between items-start mb-3">
          <div className={`${sizeClasses[size].subtitle} bg-gray-200 dark:bg-gray-700 rounded w-16`} />
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        {/* Image skeleton */}
        <div className="flex justify-center mb-4">
          <div className={`${sizeClasses[size].image} bg-gray-200 dark:bg-gray-700 rounded-lg`} />
        </div>

        {/* Name skeleton */}
        <div className="flex justify-center mb-2">
          <div className={`${sizeClasses[size].title} bg-gray-200 dark:bg-gray-700 rounded w-24`} />
        </div>

        {/* Type badges skeleton */}
        <div className="flex justify-center gap-2 mb-3">
          <div className={`${sizeClasses[size].badge} bg-gray-200 dark:bg-gray-700 rounded-full`} />
          <div className={`${sizeClasses[size].badge} bg-gray-200 dark:bg-gray-700 rounded-full`} />
        </div>

        {/* Stats skeleton */}
        {showStats && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className={`${sizeClasses[size].subtitle} bg-gray-200 dark:bg-gray-700 rounded mb-1 mx-auto w-8`} />
                  <div className={`${sizeClasses[size].subtitle} bg-gray-200 dark:bg-gray-700 rounded mx-auto w-6`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};