// Raw data structure from pokemon_kanto_dataset.json
export interface PokemonRawData {
  dex_number: string;
  name: string;
  type_01: string;
  type_02: string;
  ability_01: string;
  ability_02: string;
  hidden_ability: string;
  egg_group_01: string;
  egg_group_02: string;
  is_legendary: string;
  bio: string;
  hp: string;
  attack: string;
  defense: string;
  sp_attack: string;
  sp_defense: string;
  speed: string;
}

// Helper interface for processing raw data into arrays
export interface PokemonProcessedData {
  dexNumber: string;
  name: string;
  types: string[];
  abilities: string[];
  hiddenAbility: string;
  eggGroups: string[];
  isLegendary: boolean;
  bio: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
  };
}

// Processed data structure for the application
export interface Pokemon {
  id: number;
  dexNumber: string;
  name: string;
  localizedName?: string;
  imageUrl: string;
  types: PokemonType[];
  abilities: Ability[];
  hiddenAbility?: Ability;
  eggGroups: string[];
  isLegendary: boolean;
  bio: string;
  description?: string;
  height?: string;
  weight?: string;
  category?: string;
  generation?: number;
  stats: PokemonStats;
}

export interface PokemonType {
  name: string;
  color: string;
}

export interface Ability {
  name: string;
  isHidden?: boolean;
}

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  'special-attack': number;
  'special-defense': number;
  speed: number;
  total?: number;
}