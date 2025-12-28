// tests/utils/calculations.spec.ts
import { describe, it, expect } from 'vitest';
import { calculateSpent, calculateRemaining, calculatePercentUsed } from './index';

describe('calculateSpent', () => {
  describe('When input is a number', () => {
    it('Should return the same numeric value', () => {
      const result = calculateSpent(3000);
      expect(result).toBe(3000);
    });
  });

  describe('When input is a list of amount items', () => {
    it('Should sum all item amounts', () => {
      const result = calculateSpent([
        { amount: 1000 },
        { amount: 1000 },
        { amount: 1000 },
      ]);

      expect(result).toBe(3000);
    });

    it('Should ignore undefined items in the list', () => {
      const result = calculateSpent([
        { amount: 1000 },
        undefined,
        { amount: 2000 },
      ]);

      expect(result).toBe(3000);
    });

    it('Should return zero when the list is empty', () => {
      const result = calculateSpent([]);
      expect(result).toBe(0);
    });
  });
});

describe('calculateRemaining', () => {
  it('Should return the remaining value based on maximum and spent amount', () => {
    const result = calculateRemaining(
      [
        { amount: 1000 },
        { amount: 2000 },
      ],
      5000,
    );

    expect(result).toBe(2000);
  });

  it('Should return the remaining value when input is a number', () => {
    const result = calculateRemaining(3000, 5000);
    expect(result).toBe(2000);
  });
});

describe('calculatePercentUsed', () => {
  describe('Standard percentage calculation', () => {
    it('Should return the correct percentage based on spent and maximum', () => {
      const result = calculatePercentUsed(
        [
          { amount: 1000 },
          { amount: 2000 },
        ],
        5000,
      );

      expect(result).toBe(60);
    });
  });

  describe('Boundary and edge cases', () => {
    it('Should return 0 when maximum is zero or negative', () => {
      expect(calculatePercentUsed(3000, 0)).toBe(0);
      expect(calculatePercentUsed(3000, -100)).toBe(0);
    });

    it('Should cap the percentage at 100 when spent exceeds maximum', () => {
      const result = calculatePercentUsed(
        [
          { amount: 3000 },
          { amount: 3000 },
        ],
        5000,
      );

      expect(result).toBe(100);
    });

    it('Should return 0 when no amount was spent', () => {
      const result = calculatePercentUsed([], 5000);
      expect(result).toBe(0);
    });
  });
});
