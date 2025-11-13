export function formatCurrency(value: number, signal: boolean = true): string {
  const absValue = Math.abs(value);
  const sign = signal ? (value >= 0 ? '+' : '-') : '';

  const useCompact = absValue >= 1_000_000;

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: useCompact ? 'decimal' : 'currency',
    currency: 'BRL',
    notation: useCompact ? 'compact' : 'standard',
    compactDisplay: 'short',
    minimumFractionDigits: useCompact ? 1 : 2,
    maximumFractionDigits: useCompact ? 1 : 2,
  });

  const formatted = formatter.format(absValue);

  return useCompact ? `${sign}R$ ${formatted}` : `${sign}${formatted}`;
}
