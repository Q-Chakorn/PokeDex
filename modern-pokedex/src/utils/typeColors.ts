// Pokemon type colors mapping with improved accessibility
export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

// Text colors for better contrast on type badges
export const TYPE_TEXT_COLORS: Record<string, string> = {
  normal: '#000000',
  fire: '#FFFFFF',
  water: '#FFFFFF',
  electric: '#000000',
  grass: '#000000',
  ice: '#000000',
  fighting: '#FFFFFF',
  poison: '#FFFFFF',
  ground: '#000000',
  flying: '#000000',
  psychic: '#FFFFFF',
  bug: '#000000',
  rock: '#FFFFFF',
  ghost: '#FFFFFF',
  dragon: '#FFFFFF',
  dark: '#FFFFFF',
  steel: '#000000',
  fairy: '#000000',
};

// Hover colors for interactive elements
export const TYPE_HOVER_COLORS: Record<string, string> = {
  normal: '#9C9C6B',
  fire: '#E67328',
  water: '#5A7FE8',
  electric: '#F0D028',
  grass: '#6BB048',
  ice: '#86C6C6',
  fighting: '#A82820',
  poison: '#943898',
  ground: '#D4B456',
  flying: '#9680E8',
  psychic: '#F04876',
  bug: '#96A018',
  rock: '#A69030',
  ghost: '#644886',
  dragon: '#6330E6',
  dark: '#644840',
  steel: '#A6A6BE',
  fairy: '#E689A0',
};

/**
 * Get the background color for a Pokemon type
 */
export function getTypeColor(typeName: string): string {
  return TYPE_COLORS[typeName.toLowerCase()] || '#68A090';
}

/**
 * Get the text color for a Pokemon type (for better contrast)
 */
export function getTypeTextColor(typeName: string): string {
  return TYPE_TEXT_COLORS[typeName.toLowerCase()] || '#FFFFFF';
}

/**
 * Get the hover color for a Pokemon type
 */
export function getTypeHoverColor(typeName: string): string {
  return TYPE_HOVER_COLORS[typeName.toLowerCase()] || '#5A9088';
}

/**
 * Get all available type colors
 */
export function getAllTypeColors(): Record<string, string> {
  return { ...TYPE_COLORS };
}

/**
 * Check if a type name is valid
 */
export function isValidType(typeName: string): boolean {
  return typeName.toLowerCase() in TYPE_COLORS;
}

/**
 * Get type color with opacity
 */
export function getTypeColorWithOpacity(typeName: string, opacity: number): string {
  const color = getTypeColor(typeName);
  // Convert hex to rgba
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Get gradient colors for dual-type Pokemon
 */
export function getDualTypeGradient(type1: string, type2: string): string {
  const color1 = getTypeColor(type1);
  const color2 = getTypeColor(type2);
  return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
}