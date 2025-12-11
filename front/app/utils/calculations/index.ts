import type { SpendInput, AmountItem } from './calculations.types';

export function calculateSpent(input: SpendInput): number {
  if (typeof input === 'number') {
    return input;
  }

  let total = 0;

  for (let i = 0; i < input.length; i++) {
    const item: AmountItem | undefined = input[i];
    if (item) {
      total += item.amount;
    }
  }

  return total;
}

export function calculateRemaining(input: SpendInput, maximum: number): number {
  return maximum - calculateSpent(input);
}

export function calculatePercentUsed(input: SpendInput, maximum: number): number {
  if (maximum <= 0) {
    return 0;
  }

  const spent = calculateSpent(input);
  const percent = (spent / maximum) * 100;

  return percent > 100 ? 100 : percent;
}
