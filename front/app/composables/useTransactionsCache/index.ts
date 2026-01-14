import type { TransactionsCache } from './useTransactionsCache.type';

export const useTransactionsCache = () =>
  useState<TransactionsCache | null>('transactions-cache', () => null);
