import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PokemonService } from '../PokemonService';
import { apiService } from '../ApiService';
import type { Pokemon, PokemonType } from '../../types/pokemon';

// Mock the API service
vi.mock('../ApiService', () => ({
  apiService: {
    getAllPokemon: vi.fn(),
    getPokemonById: vi.fn(),
    getPokemonByName: vi.fn(),
    searchPokemon: vi.fn(),
    getAvailableTypes: vi.fn(),
    getLegendaryPokemon: vi.fn(),
    getStatsSummary: vi.fn(),
  }
}));

const mockPokemonData = [
  {
      dex_number: "#0001",
      name: "Bulbasaur",
      type_01: "Grass",
      type_02: " Poison",
      ability_01: "Overgrow",
      ability_02: "",
      hidden_ability: "Chlorophyll",
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
      is_legendary: "True",
      bio: "Mewtwo is a legendary Psychic-type Pokémon.",
      hp: "106",
      attack: "110",
      defense: "90",
      sp_attack: "154",
      sp_defense: "90",
      speed: "130"
    }
  ];

describe('PokemonService', () => {
  let service: PokemonService;
  const mockApiService = apiService as any;

  beforeEach(() => {
    service = new PokemonService();
    service.reset();
    vi.clearAllMocks();
    
    // Setup default mock responses
    mockApiService.getAllPokemon.mockResolvedValue({ data: mockPokemonData });
    mockApiService.getPokemonById.mockImplementation((id: number) => {
      const pokemon = mockPokemonData.find(p => parseInt(p.dex_number.replace('#', '').replace(/^0+/, '')) === id);
      return Promise.resolve(pokemon ? { data: pokemon } : { error: 'Not found' });
    });
    mockApiService.getPokemonByName.mockImplementation((name: string) => {
      const pokemon = mockPokemonData.find(p => p.name.toLowerCase() === name.toLowerCase());
      return Promise.resolve(pokemon ? { data: pokemon } : { error: 'Not found' });
    });
    mockApiService.searchPokemon.mockResolvedValue({ data: mockPokemonData });
    mockApiService.getAvailableTypes.mockResolvedValue({ data: ['Grass', 'Poison', 'Electric', 'Psychic'] });
    mockApiService.getLegendaryPokemon.mockResolvedValue({ 
      data: mockPokemonData.filter(p => p.is_legendary === 'True') 
    });
    mockApiService.getStatsSummary.mockResolvedValue({
      data: {
        totalPokemon: 3,
        legendaryCount: 1,
        typeDistribution: { Grass: 1, Poison: 1, Electric: 1, Psychic: 1 }
      }
    });
  });

  describe('loadPokemon', () => {
    it('should load and transform Pokemon data', async () => {
      const pokemon = await service.loadPokemon();
      
      expect(pokemon).toHaveLength(3);
      expect(pokemon[0]).toMatchObject({
        id: 1,
        name: 'Bulbasaur',
        isLegendary: false
      });
      expect(pokemon[0].types).toHaveLength(2);
      expect(pokemon[0].types[0].name).toBe('Grass');
      expect(pokemon[0].types[1].name).toBe('Poison');
    });

    it('should return cached data on subsequent calls', async () => {
      const firstCall = await service.loadPokemon();
      const secondCall = await service.loadPokemon();
      
      expect(firstCall).toBe(secondCall);
      expect(mockApiService.getAllPokemon).toHaveBeenCalledTimes(1);
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
      expect(mockApiService.getPokemonById).toHaveBeenCalledWith(25);
    });

    it('should return null for non-existent ID', async () => {
      const pokemon = await service.getPokemonById(999);
      
      expect(pokemon).toBeNull();
      expect(mockApiService.getPokemonById).toHaveBeenCalledWith(999);
    });
  });

  describe('getPokemonByName', () => {
    it('should return Pokemon by name (case-insensitive)', async () => {
      const pokemon = await service.getPokemonByName('pikachu');
      
      expect(pokemon).not.toBeNull();
      expect(pokemon?.name).toBe('Pikachu');
      expect(mockApiService.getPokemonByName).toHaveBeenCalledWith('pikachu');
    });

    it('should return Pokemon by exact name', async () => {
      const pokemon = await service.getPokemonByName('Bulbasaur');
      
      expect(pokemon).not.toBeNull();
      expect(pokemon?.name).toBe('Bulbasaur');
      expect(mockApiService.getPokemonByName).toHaveBeenCalledWith('Bulbasaur');
    });

    it('should return null for non-existent name', async () => {
      const pokemon = await service.getPokemonByName('NonExistent');
      
      expect(pokemon).toBeNull();
      expect(mockApiService.getPokemonByName).toHaveBeenCalledWith('NonExistent');
    });
  });

  describe('searchPokemon', () => {
    it('should return all Pokemon when no filters', async () => {
      const pokemon = await service.searchPokemon();
      
      expect(pokemon).toHaveLength(3);
      expect(mockApiService.searchPokemon).toHaveBeenCalledWith({});
    });

    it('should filter by name query', async () => {
      mockApiService.searchPokemon.mockResolvedValue({ 
        data: mockPokemonData.filter(p => p.name.toLowerCase().includes('pika')) 
      });
      
      const pokemon = await service.searchPokemon({ query: 'pika' });
      
      expect(pokemon).toHaveLength(1);
      expect(pokemon[0].name).toBe('Pikachu');
      expect(mockApiService.searchPokemon).toHaveBeenCalledWith({ query: 'pika' });
    });

    it('should filter by type', async () => {
      mockApiService.searchPokemon.mockResolvedValue({ 
        data: mockPokemonData.filter(p => p.type_01 === 'Electric') 
      });
      
      const pokemon = await service.searchPokemon({ 
        types: [{ name: 'Electric', color: '#F8D030' }] 
      });
      
      expect(pokemon).toHaveLength(1);
      expect(pokemon[0].name).toBe('Pikachu');
      expect(mockApiService.searchPokemon).toHaveBeenCalledWith({ type: 'Electric' });
    });

    it('should filter by legendary status', async () => {
      mockApiService.searchPokemon.mockResolvedValue({ 
        data: mockPokemonData.filter(p => p.is_legendary === 'True') 
      });
      
      const pokemon = await service.searchPokemon({ isLegendary: true });
      
      expect(pokemon).toHaveLength(1);
      expect(pokemon[0].name).toBe('Mewtwo');
      expect(mockApiService.searchPokemon).toHaveBeenCalledWith({ legendary: true });
    });
  });

  describe('getPokemonByType', () => {
    it('should return Pokemon of specific type', async () => {
      mockApiService.searchPokemon.mockResolvedValue({ 
        data: mockPokemonData.filter(p => p.type_01 === 'Grass' || p.type_02 === 'Grass') 
      });
      
      const pokemon = await service.getPokemonByType({ name: 'Grass', color: '#78C850' });
      
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
      expect(mockApiService.getLegendaryPokemon).toHaveBeenCalled();
    });
  });

  describe('getPokemonCount', () => {
    it('should return total Pokemon count', async () => {
      const count = await service.getPokemonCount();
      
      expect(count).toBe(3);
      expect(mockApiService.getStatsSummary).toHaveBeenCalled();
    });
  });

  describe('getAvailableTypes', () => {
    it('should return all unique types sorted', async () => {
      const types = await service.getAvailableTypes();
      
      expect(types).toHaveLength(4);
      expect(types.map(t => t.name)).toEqual(['Electric', 'Grass', 'Poison', 'Psychic']);
      expect(mockApiService.getAvailableTypes).toHaveBeenCalled();
    });
  });

  describe('getStatsSummary', () => {
    it('should return stats summary', async () => {
      const stats = await service.getStatsSummary();
      
      expect(stats).toEqual({
        totalPokemon: 3,
        legendaryCount: 1,
        typeDistribution: {
          Grass: 1,
          Poison: 1,
          Electric: 1,
          Psychic: 1
        }
      });
      expect(mockApiService.getStatsSummary).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle API errors gracefully', async () => {
      mockApiService.getAllPokemon.mockResolvedValue({ error: 'Network error' });
      
      await expect(service.loadPokemon()).rejects.toThrow('Network error');
    });

    it('should return empty array on search error', async () => {
      mockApiService.searchPokemon.mockResolvedValue({ error: 'Search failed' });
      
      const result = await service.searchPokemon({ query: 'test' });
      expect(result).toEqual([]);
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