import React, { useState } from 'react';
import { getPokemonImageUrl, getTypeEmoji } from '../../utils/pokemonImage';

interface PokemonImageProps {
  dexNumber: string;
  name: string;
  primaryType?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  style?: React.CSSProperties;
}

export const PokemonImage: React.FC<PokemonImageProps> = ({
  dexNumber,
  name,
  primaryType = 'Normal',
  size = 'medium',
  className = '',
  style = {}
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = getPokemonImageUrl(dexNumber);
  const fallbackEmoji = getTypeEmoji(primaryType);

  const sizeStyles = {
    small: { width: '80px', height: '80px', fontSize: '20px', borderRadius: '12px' },
    medium: { width: '120px', height: '120px', fontSize: '36px', borderRadius: '16px' },
    large: { width: '160px', height: '160px', fontSize: '60px', borderRadius: '20px' }
  };

  const currentSize = sizeStyles[size];

  const containerStyle: React.CSSProperties = {
    width: currentSize.width,
    height: currentSize.height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    // Remove all styling - no background, no border, no padding
    ...Object.fromEntries(Object.entries(style).filter(([key]) => 
      !['background', 'backgroundColor', 'border', 'borderRadius', 'boxShadow', 'padding'].includes(key)
    ))
  };

  const imageStyle: React.CSSProperties = {
    width: '100%', // Fill the container completely
    height: '100%', // Fill the container completely
    objectFit: 'contain',
    transition: 'opacity 0.3s ease',
    opacity: imageLoaded && !imageError ? 1 : 0
  };

  const fallbackStyle: React.CSSProperties = {
    fontSize: currentSize.fontSize,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: !imageLoaded || imageError ? 1 : 0,
    transition: 'opacity 0.3s ease'
  };

  const loadingStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: !imageLoaded && !imageError ? 1 : 0,
    transition: 'opacity 0.3s ease'
  };

  return (
    <div className={className} style={containerStyle}>
      {/* Pokemon Image */}
      <img
        src={imageUrl}
        alt={name}
        style={imageStyle}
        onLoad={() => {
          setImageLoaded(true);
          setImageError(false);
        }}
        onError={() => {
          setImageLoaded(false);
          setImageError(true);
        }}
      />

      {/* Loading Spinner */}
      <div style={loadingStyle}>
        <div style={{
          width: '24px',
          height: '24px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderTop: '2px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>

      {/* Fallback Emoji */}
      <div style={fallbackStyle}>
        {fallbackEmoji}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};