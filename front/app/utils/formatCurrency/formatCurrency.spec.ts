import { describe, it, expect } from 'vitest';
import { formatCurrency } from '.';

function normalizeSpaces(value: string) {
  return value.replace(/\u00a0/g, ' ');
}

describe('formatCurrency', () => {
  describe('Standard currency formatting (below 1,000,000)', () => {
    it('Should format a positive value with currency and plus sign by default', () => {
      const result = normalizeSpaces(formatCurrency(1000));
      expect(result).toBe('+R$ 1.000,00');
    });

    it('Should format a negative value with currency and minus sign', () => {
      const result = normalizeSpaces(formatCurrency(-1000));
      expect(result).toBe('-R$ 1.000,00');
    });

    it('Should hide the sign when signal is disabled', () => {
      const result = normalizeSpaces(formatCurrency(-1000, false));
      expect(result).toBe('R$ 1.000,00');
    });
  });

  describe('Compact currency formatting (from 1,000,000)', () => {
    it('Should format values equal or above one million using compact notation', () => {
      const result = normalizeSpaces(formatCurrency(1_000_000));
      expect(result).toBe('+R$ 1,0 mi');
    });

    it('Should keep one decimal place in compact notation when applicable', () => {
      const result = normalizeSpaces(formatCurrency(7_500_000));
      expect(result).toBe('+R$ 7,5 mi');
    });

    it('Should format negative compact values with minus sign', () => {
      const result = normalizeSpaces(formatCurrency(-2_000_000));
      expect(result).toBe('-R$ 2,0 mi');
    });

    it('Should hide the sign in compact format when signal is disabled', () => {
      const result = normalizeSpaces(formatCurrency(2_000_000, false));
      expect(result).toBe('R$ 2,0 mi');
    });
  });

  describe('Edge cases', () => {
    it('Should format zero as a standard currency value with plus sign', () => {
      const result = normalizeSpaces(formatCurrency(0));
      expect(result).toBe('+R$ 0,00');
    });
  });
});
