import type { TransactionsData } from '~/types/transactions.type';

export interface TableTransactionsProps {
  transactions: TransactionsData[]
  pending: boolean
}
