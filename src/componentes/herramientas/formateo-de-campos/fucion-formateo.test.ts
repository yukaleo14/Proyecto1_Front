import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  formatPercentage,
  formatCantidades,
  formatDate,
  formatFechaHora,
} from './fucion-formateo';

describe('fucion-formateo utilities', () => {
  describe('formatPrice', () => {
    it('returns empty string for null, undefined or NaN', () => {
      expect(formatPrice(null as any)).toBe('');
      expect(formatPrice(undefined as any)).toBe('');
      expect(formatPrice('invalid')).toBe('');
    });

    it('formats number with 2 decimal places using es-AR locale', () => {
      // replace non-breaking space with regular space for clean check if any
      const result = formatPrice(1234.56).replace(/\u00a0/g, ' ');
      expect(result).toBe('1.234,56');
    });

    it('formats string numbers correctly', () => {
      const result = formatPrice('1234.5').replace(/\u00a0/g, ' ');
      expect(result).toBe('1.234,50');
    });

    it('adds currency symbol when specified', () => {
      const resultArs = formatPrice(1000, 'ARS').replace(/\u00a0/g, ' ');
      expect(resultArs).toBe('$ 1.000,00');

      const resultUsd = formatPrice(1000, 'USD').replace(/\u00a0/g, ' ');
      expect(resultUsd).toBe('US$ 1.000,00');
    });
  });

  describe('formatPercentage', () => {
    it('returns empty string for null, undefined or NaN', () => {
      expect(formatPercentage(null as any)).toBe('');
      expect(formatPercentage(undefined as any)).toBe('');
      expect(formatPercentage('abc')).toBe('');
    });

    it('formats percentage correctly with % suffix', () => {
      const result = formatPercentage(21.5).replace(/\u00a0/g, ' ');
      expect(result).toBe('21,50 %');
    });
  });

  describe('formatCantidades', () => {
    it('formats integers without decimals', () => {
      const result = formatCantidades(1500).replace(/\u00a0/g, ' ');
      expect(result).toBe('1.500');
    });

    it('returns empty string for invalid input', () => {
      expect(formatCantidades(null as any)).toBe('');
      expect(formatCantidades('invalid')).toBe('');
    });
  });

  describe('formatDate', () => {
    it('returns "No tiene" for empty date', () => {
      expect(formatDate(null)).toBe('No tiene');
      expect(formatDate(undefined)).toBe('No tiene');
      expect(formatDate('')).toBe('No tiene');
    });

    it('formats ISO date string YYYY-MM-DD to DD/MM/YYYY', () => {
      expect(formatDate('2026-09-24T12:00:00')).toBe('24/09/2026');
      expect(formatDate('2026-05-03')).toBe('03/05/2026');
    });

    it('returns "Fecha inválida" for bad date string format', () => {
      expect(formatDate('invalid-date')).toBe('Fecha inválida');
    });
  });

  describe('formatFechaHora', () => {
    it('returns "No tiene" when date string is missing', () => {
      expect(formatFechaHora(null)).toBe('No tiene');
      expect(formatFechaHora(undefined)).toBe('No tiene');
    });

    it('returns "Fecha inválida" for invalid dates', () => {
      expect(formatFechaHora('invalid')).toBe('Fecha inválida');
    });
  });
});
