import {
  PokemonRawData,
  PokemonProcessedData,
  Pokemon,
  PokemonType,
  Ability,
  PokemonStats,
} from '../types/pokemon';

// Pokemon type colors mapping
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

/**
 * Converts raw Pokemon data to processed format
 */
export function processRawPokemonData(rawData: PokemonRawData): PokemonProcessedData {
  // Process types - remove empty strings and trim whitespace
  const types = [rawData.type_01, rawData.type_02]
    .filter(type => type && type.trim() !== '')
    .map(type => type.trim());

  // Process abilities - remove empty strings and trim whitespace
  const abilities = [rawData.ability_01, rawData.ability_02]
    .filter(ability => ability && ability.trim() !== '')
    .map(ability => ability.trim());

  // Process egg groups - remove empty strings and trim whitespace
  const eggGroups = [rawData.egg_group_01, rawData.egg_group_02]
    .filter(group => group && group.trim() !== '')
    .map(group => group.trim());

  return {
    dexNumber: rawData.dex_number,
    name: rawData.name,
    types,
    abilities,
    hiddenAbility: rawData.hidden_ability.trim(),
    eggGroups,
    isLegendary: rawData.is_legendary.toLowerCase() === 'true',
    bio: rawData.bio,
    stats: {
      hp: parseInt(rawData.hp, 10),
      attack: parseInt(rawData.attack, 10),
      defense: parseInt(rawData.defense, 10),
      spAttack: parseInt(rawData.sp_attack, 10),
      spDefense: parseInt(rawData.sp_defense, 10),
      speed: parseInt(rawData.speed, 10),
    },
  };
}

/**
 * Converts processed Pokemon data to final Pokemon format
 */
export function createPokemon(processedData: PokemonProcessedData): Pokemon {
  // Extract ID from dex number (remove # and leading zeros)
  const id = parseInt(processedData.dexNumber.replace('#', ''), 10);

  // Create Pokemon types with colors
  const types: PokemonType[] = processedData.types.map(typeName => ({
    name: typeName.toLowerCase(),
    color: TYPE_COLORS[typeName.toLowerCase()] || '#68A090',
  }));

  // Create abilities
  const abilities: Ability[] = processedData.abilities.map(abilityName => ({
    name: abilityName,
    isHidden: false,
  }));

  // Add hidden ability if exists
  const hiddenAbility: Ability | undefined = processedData.hiddenAbility
    ? {
        name: processedData.hiddenAbility,
        isHidden: true,
      }
    : undefined;

  // Calculate total stats
  const stats: PokemonStats = {
    ...processedData.stats,
    total:
      processedData.stats.hp +
      processedData.stats.attack +
      processedData.stats.defense +
      processedData.stats.spAttack +
      processedData.stats.spDefense +
      processedData.stats.speed,
  };

  // Generate image URL (using PokeAPI images)
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return {
    id,
    dexNumber: processedData.dexNumber,
    name: processedData.name,
    imageUrl,
    types,
    abilities,
    hiddenAbility,
    eggGroups: processedData.eggGroups,
    isLegendary: processedData.isLegendary,
    bio: processedData.bio,
    stats,
  };
}

/**
 * Transforms array of raw Pokemon data to final Pokemon array
 */
export function transformPokemonData(rawDataArray: PokemonRawData[]): Pokemon[] {
  return rawDataArray
    .map(processRawPokemonData)
    .map(createPokemon)
    .sort((a, b) => a.id - b.id); // Sort by ID
}

/**
 * Get all unique Pokemon types from a Pokemon array
 */
export function getUniqueTypes(pokemon: Pokemon[]): PokemonType[] {
  const typeSet = new Set<string>();
  const types: PokemonType[] = [];

  pokemon.forEach(p => {
    p.types.forEach(type => {
      if (!typeSet.has(type.name)) {
        typeSet.add(type.name);
        types.push(type);
      }
    });
  });

  return types.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Filter Pokemon by search query
 */
export function filterPokemonBySearch(pokemon: Pokemon[], query: string): Pokemon[] {
  if (!query.trim()) return pokemon;

  const searchTerm = query.toLowerCase().trim();
  return pokemon.filter(p =>
    p.name.toLowerCase().includes(searchTerm) ||
    p.dexNumber.includes(searchTerm) ||
    (p.localizedName && p.localizedName.toLowerCase().includes(searchTerm))
  );
}

/**
 * Filter Pokemon by selected types
 */
export function filterPokemonByTypes(pokemon: Pokemon[], selectedTypes: PokemonType[]): Pokemon[] {
  if (selectedTypes.length === 0) return pokemon;

  const selectedTypeNames = selectedTypes.map(t => t.name);
  return pokemon.filter(p =>
    p.types.some(type => selectedTypeNames.includes(type.name))
  );
}