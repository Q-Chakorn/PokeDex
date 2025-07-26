import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PokemonService } from '../PokemonService';
import type { Pokemon, PokemonType } from '../../types/pokemon';

// Mock the dataset
vi.mock('../../assets/pokemon_kanto_dataset.json', () => ({
  default: [
    {
      dex_number: "#0001",
      name: "Bulbasaur",
      type_01: "Grass",
      type_02: " Poison",
      ability_01: "Overgrow",
      ability_02: "",
      hidden_ability: "Chlorophyll",
      egg_group_01: "Monster",
      egg_group_02: " Grass",
      is_legendary: "False",
      bio: "Bulbasaur is a dual-type Grass/Poison Pokémon.",
      hp: "45",
      attack: "49",
      defense: "49",
      sp_attack: "65",
      sp_defense: "65",
      speed: "45"
    },
    {
      dex_number: "#0025",
      name: "Pikachu",
      type_01: "Electric",
      type_02: "",
      ability_01: "Static",
      ability_02: "",
      hidden_ability: "Lightning Rod",
      egg_group_01: "Field",
      egg_group_02: " Fairy",
      is_legendary: "False",
      bio: "Pikachu is an Electric-type Pokémon.",
      hp: "35",
      attack: "55",
      defense: "40",
      sp_attack: "50",
      sp_defense: "50",
      speed: "90"
    },
    {
      dex_number: "#0150",
      name: "Mewtwo",
      type_01: "Psychic",
      type_02: "",
      ability_01: "Pressure",
      ability_02: "",
      hidden_ability: "Unnerve",
      egg_group_01: "Undiscovered",
      egg_group_02: "",
      is_legendary: "True",
      bio: "Mewtwo is a legendary Psychic-type Pokémon.",
      hp: "106",
      attack: "110",
      defense: "90",
      sp_attack: "154",
      sp_defense: "90",
      speed: "130"
    }
  ]
}));

describe('PokemonService', () => {
  let service: PokemonService;

  beforeEach(() => {
    service = new PokemonService();
    service.reset();
  });

  describe('loadPokemonData', () => {
    it('should load and transform Pokemon data', async () => {
      const pokemon = await service.loadPokemonData();
      
      expect(pokemon).toHaveLength(3);
      expect(pokemon[0]).toMatchObject({
        id: 1,
        name: 'Bulbasaur',
        isLegendary: false
      });
      expect(pokemon[0].types).toHaveLength(2);
      expect(pokemon[0].types[0].name).toBe('grass');
      expect(pokemon[0].types[1].name).toBe('poison');
    });

    it('should return cached data on subsequent calls', async () => {
      const firstCall = await service.loadPokemonData();
      const secondCall = await service.loadPokemonData();
      
      expect(firstCall).toBe(secondCall);
    });
  });

  describe('getAllPokemon', () => {
    it('should return all Pokemon', async () => {
      const pokemon = await service.getAllPokemon();
      
      expect(pokemon).toHaveLength(3);
      expect(pokemon.map(p => p.name)).toEqual(['Bulbasaur', 'Pikachu', 'Mewtwo']);
    });
  });

  describe('getPokemonById', () => {
    it('should return Pokemon by ID', async () => {
      const pokemon = await service.getPokemonById(25);
      
      expect(pokemon).not.toBeNull();
      expect(pokemon?.name).toBe('Pikachu');
      expect(pokemon?.id).toBe(25);
    });

    it('should return null for non-existent ID', async () => {
      const pokemon = await service.getPokemonById(999);
      
      expect(pokemon).toBeNull();
    });
  });

  describe('getPokemonByName', () => {
    it('should return Pokemon by name (case-insensitive)', async () => {
      const pokemon = await service.getPokemonByName('pikachu');
      
      expect(pokemon).not.toBeNull();
      expect(pokemon?.name).toBe('Pikachu');
    });

    it('should return Pokemon by exact name', async () => {
      const pokemon = await service.getPokemonByName('Bulbasaur');
      
      expect(pokemon).not.toBeNull();
      expect(pokemon?.name).toBe('Bulbasaur');
    });

    it('should return null for non-existent name', async () => {
      const pokemon = await service.getPokemonByName('NonExistent');
      
      expect(pokemon).toBeNull();
    });
  });

  describe('searchPokemon', () => {
    it('should return all Pokemon when no filters', async () => {
      const pokemon = await service.searchPokemon();
      
      expect(pokemon).toHaveLength(3);
    });

    it('should filter by name query', async () => {
      const pokemon = await service.searchPokemon({ query: 'pika' });
      
      expect(pokemon).toHaveLength(1);
      expect(pokemon[0].name).toBe('Pikachu');
    });

    it('should filter by dex number query', async () => {
      const pokemon = await service.searchPokemon({ query: '#0001' });
      
      expect(pokemon).toHaveLength(1);
      expect(pokemon[0].name).toBe('Bulbasaur');
    });

    it('should filter by ID query', async () => {
      const pokemon = await service.searchPokemon({ query: '150' });
      
      expect(pokemon).toHaveLength(1);
      expect(pokemon[0].name).toBe('Mewtwo');
    });

    it('should filter by single type', async () => {
      const pokemon = await service.searchPokemon({ 
        types: [{ name: 'electric', color: '#F8D030' }] 
      });
      
      expect(pokemon).toHaveLength(1);
      expect(pokemon[0].name).toBe('Pikachu');
    });

    it('should filter by multiple types', async () => {
      const pokemon = await service.searchPokemon({ 
        types: [
          { name: 'grass', color: '#78C850' },
          { name: 'electric', color: '#F8D030' }
        ] 
      });
      
      expect(pokemon).toHaveLength(2);
      expect(pokemon.map(p => p.name)).toEqual(['Bulbasaur', 'Pikachu']);
    });

    it('should filter by legendary status (true)', async () => {
      const pokemon = await service.searchPokemon({ isLegendary: true });
      
      expect(pokemon).toHaveLength(1);
      expect(pokemon[0].name).toBe('Mewtwo');
    });

    it('should filter by legendary status (false)', async () => {
      const pokemon = await service.searchPokemon({ isLegendary: false });
      
      expect(pokemon).toHaveLength(2);
      expect(pokemon.map(p => p.name)).toEqual(['Bulbasaur', 'Pikachu']);
    });

    it('should combine multiple filters', async () => {
      const pokemon = await service.searchPokemon({ 
        query: 'u',
        isLegendary: false 
      });
      
      expect(pokemon).toHaveLength(2);
      expect(pokemon.map(p => p.name)).toEqual(['Bulbasaur', 'Pikachu']);
    });
  });

  describe('getPokemonByType', () => {
    it('should return Pokemon of specific type', async () => {
      const pokemon = await service.getPokemonByType({ name: 'grass', color: '#78C850' });
      
      expect(pokemon).toHaveLength(1);
      expect(pokemon[0].name).toBe('Bulbasaur');
    });
  });

  describe('getLegendaryPokemon', () => {
    it('should return only legendary Pokemon', async () => {
      const pokemon = await service.getLegendaryPokemon();
      
      expect(pokemon).toHaveLength(1);
      expect(pokemon[0].name).toBe('Mewtwo');
      expect(pokemon[0].isLegendary).toBe(true);
    });
  });

  describe('getPokemonCount', () => {
    it('should return total Pokemon count', async () => {
      const count = await service.getPokemonCount();
      
      expect(count).toBe(3);
    });
  });

  describe('getAllTypes', () => {
    it('should return all unique types sorted', async () => {
      const types = await service.getAllTypes();
      
      expect(types).toHaveLength(4);
      expect(types.map(t => t.name)).toEqual(['electric', 'grass', 'poison', 'psychic']);
    });
  });

  describe('getStatsSummary', () => {
    it('should return stats summary', async () => {
      const stats = await service.getStatsSummary();
      
      expect(stats).toEqual({
        totalPokemon: 3,
        legendaryCount: 1,
        typeDistribution: {
          grass: 1,
          poison: 1,
          electric: 1,
          psychic: 1
        }
      });
    });
  });

  describe('error handling', () => {
    it('should handle data loading errors', async () => {
      // Mock a service that throws an error
      const errorService = new PokemonService();
      
      // Override the loadPokemonData method to throw an error
      vi.spyOn(errorService as any, 'loadPokemonData').mockImplementation(() => {
        throw new Error('Network error');
      });

      await expect(errorService.getAllPokemon()).rejects.toThrow();
    });
  });

  describe('reset', () => {
    it('should reset service state', async () => {
      // Load data first
      await service.getAllPokemon();
      
      // Reset service
      service.reset();
      
      // Verify state is reset
      expect((service as any).isLoaded).toBe(false);
      expect((service as any).pokemonData).toEqual([]);
    });
  });
});