import type { TransactionsData } from '../transactions.type';

export interface TableTransactionsProps {
  transactions: TransactionsData[]
  pending: boolean
}
