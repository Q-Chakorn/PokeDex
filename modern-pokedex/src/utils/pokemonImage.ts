/**
 * Utility functions for Pokemon images
 */

/**
 * Get Pokemon image URL from PokeAPI
 * @param dexNumber - Pokemon dex number (e.g., "#0001")
 * @returns Image URL
 */
export const getPokemonImageUrl = (dexNumber: string): string => {
  // Extract number from dexNumber (e.g., "#0001" -> "1")
  const pokemonId = dexNumber.replace('#', '').replace(/^0+/, '') || '1';
  
  // Use PokeAPI official artwork (high quality)
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
};

/**
 * Get Pokemon sprite URL (smaller, pixel art style)
 * @param dexNumber - Pokemon dex number (e.g., "#0001")
 * @returns Sprite URL
 */
export const getPokemonSpriteUrl = (dexNumber: string): string => {
  const pokemonId = dexNumber.replace('#', '').replace(/^0+/, '') || '1';
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
};

/**
 * Get Pokemon animated GIF URL
 * @param dexNumber - Pokemon dex number (e.g., "#0001")
 * @returns Animated GIF URL
 */
export const getPokemonAnimatedUrl = (dexNumber: string): string => {
  const pokemonId = dexNumber.replace('#', '').replace(/^0+/, '') || '1';
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemonId}.gif`;
};

/**
 * Get fallback emoji for Pokemon type
 * @param typeName - Pokemon type name
 * @returns Emoji string
 */
export const getTypeEmoji = (typeName: string): string => {
  const typeEmojis: { [key: string]: string } = {
    Fire: '🔥',
    Water: '💧',
    Grass: '🌿',
    Electric: '⚡',
    Psychic: '🔮',
    Bug: '🐛',
    Normal: '⭐',
    Poison: '☠️',
    Flying: '🦅',
    Rock: '🪨',
    Ground: '🌍',
    Fighting: '👊',
    Ghost: '👻',
    Steel: '⚔️',
    Ice: '❄️',
    Dragon: '🐉',
    Dark: '🌙',
    Fairy: '🧚'
  };
  return typeEmojis[typeName] || '❓';
};