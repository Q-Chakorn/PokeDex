import { describe, it, expect } from 'vitest';
import {
  processRawPokemonData,
  createPokemon,
  transformPokemonData,
  getUniqueTypes,
  filterPokemonBySearch,
  filterPokemonByTypes,
  TYPE_COLORS,
} from '../pokemonTransform';
import { PokemonRawData, Pokemon } from '../../types/pokemon';

describe('pokemonTransform', () => {
  const mockRawData: PokemonRawData = {
    dex_number: '#0001',
    name: 'Bulbasaur',
    type_01: 'Grass',
    type_02: ' Poison',
    ability_01: 'Overgrow',
    ability_02: '',
    hidden_ability: 'Chlorophyll',
    egg_group_01: 'Monster',
    egg_group_02: ' Grass',
    is_legendary: 'False',
    bio: 'A grass/poison type Pokemon.',
    hp: '45',
    attack: '49',
    defense: '49',
    sp_attack: '65',
    sp_defense: '65',
    speed: '45',
  };

  describe('processRawPokemonData', () => {
    it('should process raw Pokemon data correctly', () => {
      const result = processRawPokemonData(mockRawData);

      expect(result).toEqual({
        dexNumber: '#0001',
        name: 'Bulbasaur',
        types: ['Grass', 'Poison'],
        abilities: ['Overgrow'],
        hiddenAbility: 'Chlorophyll',
        eggGroups: ['Monster', 'Grass'],
        isLegendary: false,
        bio: 'A grass/poison type Pokemon.',
        stats: {
          hp: 45,
          attack: 49,
          defense: 49,
          spAttack: 65,
          spDefense: 65,
          speed: 45,
        },
      });
    });

    it('should handle empty strings in types and abilities', () => {
      const dataWithEmptyFields: PokemonRawData = {
        ...mockRawData,
        type_02: '',
        ability_02: '',
        egg_group_02: '',
      };

      const result = processRawPokemonData(dataWithEmptyFields);

      expect(result.types).toEqual(['Grass']);
      expect(result.abilities).toEqual(['Overgrow']);
      expect(result.eggGroups).toEqual(['Monster']);
    });

    it('should parse legendary status correctly', () => {
      const legendaryData: PokemonRawData = {
        ...mockRawData,
        is_legendary: 'True',
      };

      const result = processRawPokemonData(legendaryData);
      expect(result.isLegendary).toBe(true);
    });
  });

  describe('createPokemon', () => {
    it('should create Pokemon object with correct structure', () => {
      const processedData = processRawPokemonData(mockRawData);
      const result = createPokemon(processedData);

      expect(result).toMatchObject({
        id: 1,
        dexNumber: '#0001',
        name: 'Bulbasaur',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
        types: [
          { name: 'grass', color: TYPE_COLORS.grass },
          { name: 'poison', color: TYPE_COLORS.poison },
        ],
        abilities: [{ name: 'Overgrow', isHidden: false }],
        hiddenAbility: { name: 'Chlorophyll', isHidden: true },
        eggGroups: ['Monster', 'Grass'],
        isLegendary: false,
        bio: 'A grass/poison type Pokemon.',
        stats: {
          hp: 45,
          attack: 49,
          defense: 49,
          spAttack: 65,
          spDefense: 65,
          speed: 45,
          total: 318,
        },
      });
    });

    it('should handle Pokemon without hidden ability', () => {
      const dataWithoutHidden = processRawPokemonData({
        ...mockRawData,
        hidden_ability: '',
      });

      const result = createPokemon(dataWithoutHidden);
      expect(result.hiddenAbility).toBeUndefined();
    });
  });

  describe('transformPokemonData', () => {
    it('should transform array of raw data to Pokemon array', () => {
      const rawDataArray = [mockRawData];
      const result = transformPokemonData(rawDataArray);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 1,
        name: 'Bulbasaur',
        dexNumber: '#0001',
      });
    });

    it('should sort Pokemon by ID', () => {
      const rawDataArray = [
        { ...mockRawData, dex_number: '#0003', name: 'Venusaur' },
        { ...mockRawData, dex_number: '#0001', name: 'Bulbasaur' },
        { ...mockRawData, dex_number: '#0002', name: 'Ivysaur' },
      ];

      const result = transformPokemonData(rawDataArray);

      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(3);
    });
  });

  describe('getUniqueTypes', () => {
    it('should return unique types from Pokemon array', () => {
      const pokemon: Pokemon[] = [
        {
          id: 1,
          types: [
            { name: 'grass', color: TYPE_COLORS.grass },
            { name: 'poison', color: TYPE_COLORS.poison },
          ],
        } as Pokemon,
        {
          id: 2,
          types: [{ name: 'fire', color: TYPE_COLORS.fire }],
        } as Pokemon,
        {
          id: 3,
          types: [{ name: 'grass', color: TYPE_COLORS.grass }],
        } as Pokemon,
      ];

      const result = getUniqueTypes(pokemon);

      expect(result).toHaveLength(3);
      expect(result.map(t => t.name)).toEqual(['fire', 'grass', 'poison']);
    });
  });

  describe('filterPokemonBySearch', () => {
    const pokemon: Pokemon[] = [
      { id: 1, name: 'Bulbasaur', dexNumber: '#0001' } as Pokemon,
      { id: 2, name: 'Ivysaur', dexNumber: '#0002' } as Pokemon,
      { id: 3, name: 'Venusaur', dexNumber: '#0003' } as Pokemon,
    ];

    it('should filter Pokemon by name', () => {
      const result = filterPokemonBySearch(pokemon, 'bulba');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Bulbasaur');
    });

    it('should filter Pokemon by dex number', () => {
      const result = filterPokemonBySearch(pokemon, '0002');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Ivysaur');
    });

    it('should return all Pokemon for empty search', () => {
      const result = filterPokemonBySearch(pokemon, '');
      expect(result).toHaveLength(3);
    });

    it('should be case insensitive', () => {
      const result = filterPokemonBySearch(pokemon, 'BULBA');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Bulbasaur');
    });
  });

  describe('filterPokemonByTypes', () => {
    const pokemon: Pokemon[] = [
      {
        id: 1,
        types: [
          { name: 'grass', color: TYPE_COLORS.grass },
          { name: 'poison', color: TYPE_COLORS.poison },
        ],
      } as Pokemon,
      {
        id: 2,
        types: [{ name: 'fire', color: TYPE_COLORS.fire }],
      } as Pokemon,
    ];

    it('should filter Pokemon by selected types', () => {
      const selectedTypes = [{ name: 'grass', color: TYPE_COLORS.grass }];
      const result = filterPokemonByTypes(pokemon, selectedTypes);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should return all Pokemon when no types selected', () => {
      const result = filterPokemonByTypes(pokemon, []);
      expect(result).toHaveLength(2);
    });

    it('should filter Pokemon with multiple selected types', () => {
      const selectedTypes = [
        { name: 'grass', color: TYPE_COLORS.grass },
        { name: 'fire', color: TYPE_COLORS.fire },
      ];
      const result = filterPokemonByTypes(pokemon, selectedTypes);

      expect(result).toHaveLength(2);
    });
  });
});