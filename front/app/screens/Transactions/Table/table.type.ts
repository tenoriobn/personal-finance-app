import type { TransactionsData } from '../transactions.type';

export interface TableProps {
  transactions: TransactionsData[]
  pending: boolean
}
