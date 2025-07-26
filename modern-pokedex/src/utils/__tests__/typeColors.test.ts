import { describe, it, expect } from 'vitest';
import {
  getTypeColor,
  getTypeTextColor,
  getTypeHoverColor,
  getAllTypeColors,
  isValidType,
  getTypeColorWithOpacity,
  getDualTypeGradient,
  TYPE_COLORS,
  TYPE_TEXT_COLORS,
  TYPE_HOVER_COLORS
} from '../typeColors';

describe('typeColors utilities', () => {
  describe('getTypeColor', () => {
    it('should return correct color for valid type', () => {
      expect(getTypeColor('fire')).toBe('#F08030');
      expect(getTypeColor('water')).toBe('#6890F0');
      expect(getTypeColor('grass')).toBe('#78C850');
    });

    it('should be case insensitive', () => {
      expect(getTypeColor('FIRE')).toBe('#F08030');
      expect(getTypeColor('Fire')).toBe('#F08030');
      expect(getTypeColor('fIrE')).toBe('#F08030');
    });

    it('should return default color for invalid type', () => {
      expect(getTypeColor('invalid')).toBe('#68A090');
      expect(getTypeColor('')).toBe('#68A090');
    });
  });

  describe('getTypeTextColor', () => {
    it('should return correct text color for valid type', () => {
      expect(getTypeTextColor('fire')).toBe('#FFFFFF');
      expect(getTypeTextColor('electric')).toBe('#000000');
      expect(getTypeTextColor('water')).toBe('#FFFFFF');
    });

    it('should be case insensitive', () => {
      expect(getTypeTextColor('FIRE')).toBe('#FFFFFF');
      expect(getTypeTextColor('Electric')).toBe('#000000');
    });

    it('should return default text color for invalid type', () => {
      expect(getTypeTextColor('invalid')).toBe('#FFFFFF');
    });
  });

  describe('getTypeHoverColor', () => {
    it('should return correct hover color for valid type', () => {
      expect(getTypeHoverColor('fire')).toBe('#E67328');
      expect(getTypeHoverColor('water')).toBe('#5A7FE8');
    });

    it('should be case insensitive', () => {
      expect(getTypeHoverColor('FIRE')).toBe('#E67328');
    });

    it('should return default hover color for invalid type', () => {
      expect(getTypeHoverColor('invalid')).toBe('#5A9088');
    });
  });

  describe('getAllTypeColors', () => {
    it('should return all type colors', () => {
      const colors = getAllTypeColors();
      
      expect(colors).toEqual(TYPE_COLORS);
      expect(Object.keys(colors)).toHaveLength(18);
      expect(colors.fire).toBe('#F08030');
      expect(colors.water).toBe('#6890F0');
    });

    it('should return a copy of the colors object', () => {
      const colors = getAllTypeColors();
      colors.fire = '#000000';
      
      expect(TYPE_COLORS.fire).toBe('#F08030');
    });
  });

  describe('isValidType', () => {
    it('should return true for valid types', () => {
      expect(isValidType('fire')).toBe(true);
      expect(isValidType('water')).toBe(true);
      expect(isValidType('grass')).toBe(true);
      expect(isValidType('electric')).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(isValidType('FIRE')).toBe(true);
      expect(isValidType('Fire')).toBe(true);
      expect(isValidType('fIrE')).toBe(true);
    });

    it('should return false for invalid types', () => {
      expect(isValidType('invalid')).toBe(false);
      expect(isValidType('')).toBe(false);
      expect(isValidType('unknown')).toBe(false);
    });

    it('should validate all known types', () => {
      const knownTypes = [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice',
        'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
        'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
      ];

      knownTypes.forEach(type => {
        expect(isValidType(type)).toBe(true);
      });
    });
  });

  describe('getTypeColorWithOpacity', () => {
    it('should return rgba color with correct opacity', () => {
      // Fire type: #F08030 = rgb(240, 128, 48)
      expect(getTypeColorWithOpacity('fire', 0.5)).toBe('rgba(240, 128, 48, 0.5)');
      expect(getTypeColorWithOpacity('fire', 1)).toBe('rgba(240, 128, 48, 1)');
      expect(getTypeColorWithOpacity('fire', 0)).toBe('rgba(240, 128, 48, 0)');
    });

    it('should work with different types', () => {
      // Water type: #6890F0 = rgb(104, 144, 240)
      expect(getTypeColorWithOpacity('water', 0.3)).toBe('rgba(104, 144, 240, 0.3)');
    });

    it('should handle invalid types with default color', () => {
      // Default color: #68A090 = rgb(104, 160, 144)
      expect(getTypeColorWithOpacity('invalid', 0.5)).toBe('rgba(104, 160, 144, 0.5)');
    });
  });

  describe('getDualTypeGradient', () => {
    it('should return correct gradient for two types', () => {
      const gradient = getDualTypeGradient('fire', 'water');
      expect(gradient).toBe('linear-gradient(135deg, #F08030 0%, #6890F0 100%)');
    });

    it('should work with same type twice', () => {
      const gradient = getDualTypeGradient('fire', 'fire');
      expect(gradient).toBe('linear-gradient(135deg, #F08030 0%, #F08030 100%)');
    });

    it('should handle invalid types with default colors', () => {
      const gradient = getDualTypeGradient('invalid1', 'invalid2');
      expect(gradient).toBe('linear-gradient(135deg, #68A090 0%, #68A090 100%)');
    });
  });

  describe('color constants', () => {
    it('should have all required type colors', () => {
      const requiredTypes = [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice',
        'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
        'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
      ];

      requiredTypes.forEach(type => {
        expect(TYPE_COLORS[type]).toBeDefined();
        expect(TYPE_TEXT_COLORS[type]).toBeDefined();
        expect(TYPE_HOVER_COLORS[type]).toBeDefined();
      });
    });

    it('should have valid hex color format', () => {
      const hexColorRegex = /^#[0-9A-F]{6}$/i;

      Object.values(TYPE_COLORS).forEach(color => {
        expect(color).toMatch(hexColorRegex);
      });

      Object.values(TYPE_TEXT_COLORS).forEach(color => {
        expect(color).toMatch(hexColorRegex);
      });

      Object.values(TYPE_HOVER_COLORS).forEach(color => {
        expect(color).toMatch(hexColorRegex);
      });
    });
  });
});