import { describe, expect, it } from 'vitest';
import { formatDate } from '.';

describe('formatDate', () => {
  it('should return "Invalid Date" when given an invalid date string', () => {
    expect(formatDate('abc')).toBe('Invalid Date');
  });

  it('should format a valid date to "DD/MM/YYYY" in pt-br locale', () => {
    expect(formatDate('2024-08-19T14:23:11Z')).toBe('19/08/2024');
  });
});
