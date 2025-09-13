import { describe, expect, it } from 'vitest';
import { formatCurrency } from '.';

describe('formatCurrency', () => {
  it('should format number as BRL currency with sign and decimal numbers', () => {
    expect(formatCurrency(75.5)).toBe('+R$\u00A075,50');
  });
});
