import { describe, it, expect, vi } from 'vitest';
import {
  getLocalizedPokemonName,
  getLocalizedTypeName,
  getLocalizedAbilityName,
  formatNumber,
  getLocalizedUnit
} from '../localization';

describe('localization utilities', () => {
  describe('getLocalizedPokemonName', () => {
    it('should return Thai name for known Pokemon', () => {
      expect(getLocalizedPokemonName('pikachu', 'th')).toBe('ปิกาจู');
      expect(getLocalizedPokemonName('charizard', 'th')).toBe('ลิซาร์ดอน');
      expect(getLocalizedPokemonName('blastoise', 'th')).toBe('คาเมกซ์');
    });

    it('should return original name for unknown Pokemon in Thai', () => {
      expect(getLocalizedPokemonName('unknownpokemon', 'th')).toBe('unknownpokemon');
    });

    it('should return capitalized English name for English language', () => {
      expect(getLocalizedPokemonName('pikachu', 'en')).toBe('Pikachu');
      expect(getLocalizedPokemonName('charizard', 'en')).toBe('Charizard');
      expect(getLocalizedPokemonName('BLASTOISE', 'en')).toBe('BLASTOISE');
    });

    it('should handle case insensitive lookup for Thai', () => {
      expect(getLocalizedPokemonName('PIKACHU', 'th')).toBe('ปิกาจู');
      expect(getLocalizedPokemonName('Charizard', 'th')).toBe('ลิซาร์ดอน');
    });
  });

  describe('getLocalizedTypeName', () => {
    it('should return translated type name using translation function', () => {
      const mockT = vi.fn((key: string) => {
        const translations: Record<string, string> = {
          'types.fire': 'ไฟ',
          'types.water': 'น้ำ',
          'types.grass': 'หญ้า',
        };
        return translations[key] || key;
      });

      expect(getLocalizedTypeName('fire', 'th', mockT)).toBe('ไฟ');
      expect(getLocalizedTypeName('water', 'th', mockT)).toBe('น้ำ');
      expect(getLocalizedTypeName('grass', 'th', mockT)).toBe('หญ้า');
      
      expect(mockT).toHaveBeenCalledWith('types.fire');
      expect(mockT).toHaveBeenCalledWith('types.water');
      expect(mockT).toHaveBeenCalledWith('types.grass');
    });

    it('should handle uppercase type names', () => {
      const mockT = vi.fn((key: string) => key);
      
      getLocalizedTypeName('FIRE', 'en', mockT);
      expect(mockT).toHaveBeenCalledWith('types.fire');
    });
  });

  describe('getLocalizedAbilityName', () => {
    it('should format ability names with proper capitalization', () => {
      expect(getLocalizedAbilityName('overgrow', 'en')).toBe('Overgrow');
      expect(getLocalizedAbilityName('solar-power', 'en')).toBe('Solar Power');
      expect(getLocalizedAbilityName('chlorophyll', 'en')).toBe('Chlorophyll');
    });

    it('should handle hyphenated ability names', () => {
      expect(getLocalizedAbilityName('flame-body', 'en')).toBe('Flame Body');
      expect(getLocalizedAbilityName('water-absorb', 'en')).toBe('Water Absorb');
    });

    it('should return same format for Thai language (fallback)', () => {
      expect(getLocalizedAbilityName('overgrow', 'th')).toBe('Overgrow');
      expect(getLocalizedAbilityName('solar-power', 'th')).toBe('Solar Power');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with Thai locale', () => {
      expect(formatNumber(1234, 'th')).toBe('1,234');
      expect(formatNumber(1234567, 'th')).toBe('1,234,567');
    });

    it('should format numbers with English locale', () => {
      expect(formatNumber(1234, 'en')).toBe('1,234');
      expect(formatNumber(1234567, 'en')).toBe('1,234,567');
    });

    it('should handle decimal numbers', () => {
      expect(formatNumber(123.45, 'en')).toBe('123.45');
      expect(formatNumber(123.45, 'th')).toBe('123.45');
    });
  });

  describe('getLocalizedUnit', () => {
    it('should return translated units using translation function', () => {
      const mockT = vi.fn((key: string) => {
        const translations: Record<string, string> = {
          'units.meters': 'ม.',
          'units.kilograms': 'กก.',
          'units.centimeters': 'ซม.',
        };
        return translations[key] || key;
      });

      expect(getLocalizedUnit('meters', mockT)).toBe('ม.');
      expect(getLocalizedUnit('kilograms', mockT)).toBe('กก.');
      expect(getLocalizedUnit('centimeters', mockT)).toBe('ซม.');
      
      expect(mockT).toHaveBeenCalledWith('units.meters');
      expect(mockT).toHaveBeenCalledWith('units.kilograms');
      expect(mockT).toHaveBeenCalledWith('units.centimeters');
    });
  });
});