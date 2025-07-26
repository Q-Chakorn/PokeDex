import React from 'react';
import { useTranslation } from 'react-i18next';
import type { PokemonStats as PokemonStatsType } from '../../types/pokemon';

interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
  showValue?: boolean;
}

const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  maxValue = 255,
  color = '#3B82F6',
  showValue = true
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  const getStatColor = (value: number) => {
    if (value >= 120) return '#10B981'; // green
    if (value >= 90) return '#F59E0B';  // yellow
    if (value >= 60) return '#EF4444';  // red
    return '#6B7280'; // gray
  };

  const statColor = color === '#3B82F6' ? getStatColor(value) : color;

  return (
    <div className="flex items-center space-x-3">
      <div className="w-20 text-sm font-medium text-gray-600 dark:text-gray-400 text-right">
        {label}
      </div>
      <div className="flex-1 relative">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: statColor
            }}
          />
        </div>
        {showValue && (
          <div className="absolute right-0 top-0 h-full flex items-center">
            <span className="text-sm font-semibold text-gray-900 dark:text-white ml-2">
              {value}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

interface PokemonStatsProps {
  stats: PokemonStatsType;
  className?: string;
  showComparison?: boolean;
  comparisonStats?: PokemonStatsType;
  variant?: 'default' | 'compact' | 'detailed';
  animated?: boolean;
}

export const PokemonStats: React.FC<PokemonStatsProps> = ({
  stats,
  className = '',
  showComparison = false,
  comparisonStats,
  variant = 'default',
  animated = true
}) => {
  const { t } = useTranslation();

  const statLabels = {
    hp: t('stats.hp'),
    attack: t('stats.attack'),
    defense: t('stats.defense'),
    spAttack: t('stats.specialAttack'),
    spDefense: t('stats.specialDefense'),
    speed: t('stats.speed')
  };

  const statOrder: (keyof Omit<PokemonStatsType, 'total'>)[] = [
    'hp',
    'attack',
    'defense',
    'spAttack',
    'spDefense',
    'speed'
  ];

  const getStatRating = (value: number) => {
    if (value >= 120) return { rating: 'Excellent', color: 'text-green-600 dark:text-green-400' };
    if (value >= 90) return { rating: 'Good', color: 'text-yellow-600 dark:text-yellow-400' };
    if (value >= 60) return { rating: 'Average', color: 'text-orange-600 dark:text-orange-400' };
    return { rating: 'Poor', color: 'text-red-600 dark:text-red-400' };
  };

  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {statOrder.map((statKey) => (
            <div key={statKey} className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                {statLabels[statKey]}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats[statKey]}
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center font-bold border-t border-gray-200 dark:border-gray-700 pt-2 col-span-2">
            <span className="text-gray-900 dark:text-white">
              {t('stats.total')}
            </span>
            <span className="text-blue-600 dark:text-blue-400">
              {stats.total}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="space-y-4">
        {/* Individual Stats */}
        <div className="space-y-3">
          {statOrder.map((statKey) => (
            <div key={statKey}>
              <StatBar
                label={statLabels[statKey]}
                value={stats[statKey]}
                maxValue={255}
              />
              {variant === 'detailed' && (
                <div className="mt-1 ml-23">
                  <span className={`text-xs font-medium ${getStatRating(stats[statKey]).color}`}>
                    {getStatRating(stats[statKey]).rating}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Total Stats */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <StatBar
            label={t('stats.total')}
            value={stats.total}
            maxValue={720}
            color="#8B5CF6"
            showValue={true}
          />
          {variant === 'detailed' && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Base Stat Total:</span>
                <span className="font-semibold">{stats.total}/720</span>
              </div>
              <div className="flex justify-between">
                <span>Average:</span>
                <span className="font-semibold">{Math.round(stats.total / 6)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Comparison */}
        {showComparison && comparisonStats && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Comparison
            </h4>
            <div className="space-y-2 text-sm">
              {statOrder.map((statKey) => {
                const diff = stats[statKey] - comparisonStats[statKey];
                const isHigher = diff > 0;
                const isEqual = diff === 0;
                
                return (
                  <div key={statKey} className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      {statLabels[statKey]}
                    </span>
                    <span className={`font-medium ${
                      isEqual 
                        ? 'text-gray-500 dark:text-gray-400' 
                        : isHigher 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                    }`}>
                      {isEqual ? '=' : isHigher ? `+${diff}` : diff}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats Distribution Chart (Simple) */}
        {variant === 'detailed' && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Stats Distribution
            </h4>
            <div className="relative h-32 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <svg className="w-full h-full" viewBox="0 0 300 100">
                {/* Background grid */}
                <defs>
                  <pattern id="grid" width="50" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="300" height="100" fill="url(#grid)" />
                
                {/* Stat bars */}
                {statOrder.map((statKey, index) => {
                  const x = index * 45 + 10;
                  const height = (stats[statKey] / 255) * 80;
                  const y = 90 - height;
                  
                  return (
                    <g key={statKey}>
                      <rect
                        x={x}
                        y={y}
                        width="30"
                        height={height}
                        fill={getStatColor(stats[statKey])}
                        opacity="0.8"
                        rx="2"
                      />
                      <text
                        x={x + 15}
                        y="98"
                        textAnchor="middle"
                        fontSize="8"
                        fill="currentColor"
                        opacity="0.7"
                      >
                        {statLabels[statKey].slice(0, 3)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function for stat color
const getStatColor = (value: number) => {
  if (value >= 120) return '#10B981'; // green
  if (value >= 90) return '#F59E0B';  // yellow
  if (value >= 60) return '#EF4444';  // red
  return '#6B7280'; // gray
};