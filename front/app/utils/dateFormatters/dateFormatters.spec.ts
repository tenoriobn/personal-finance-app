import { describe, it, expect } from 'vitest';
import { formatDate, formatMonthDay } from '.';

describe('formatDate', () => {
  describe('Valid date formatting', () => {
    it('Should format an ISO date string to dd/MM/yyyy', () => {
      const result = formatDate('2025-12-04T03:00:00.000Z');
      expect(result).toBe('04/12/2025');
    });

    it('Should format a date string without time correctly', () => {
      const result = formatDate('2025-01-09');
      expect(result).toBe('09/01/2025');
    });
  });

  describe('Invalid date handling', () => {
    it('Should return "Invalid Date" when an invalid date string is provided', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('Invalid Date');
    });

    it('Should return "Invalid Date" when an empty string is provided', () => {
      const result = formatDate('');
      expect(result).toBe('Invalid Date');
    });
  });
});

describe('formatMonthDay', () => {
  describe('Valid date formatting', () => {
    it('Should format an ISO date string to "Mon - dd" format in pt-BR', () => {
      const result = formatMonthDay('2025-12-14T03:00:00.000Z');
      expect(result).toBe('Dez - 14');
    });

    it('Should capitalize the first letter of the month', () => {
      const result = formatMonthDay('2025-01-05T03:00:00.000Z');
      expect(result).toBe('Jan - 05');
    });
  });

  describe('Invalid date handling', () => {
    it('Should return "Invalid Date" when an invalid date string is provided', () => {
      const result = formatMonthDay('invalid-date');
      expect(result).toBe('Invalid Date');
    });

    it('Should return "Invalid Date" when an empty string is provided', () => {
      const result = formatMonthDay('');
      expect(result).toBe('Invalid Date');
    });
  });
});
