import type { TransactionsResponse } from '~/screens/Transactions/transactions.type';

export interface TransactionsCache {
  filters: {
    search: string | null
    categoryId: string | null
    sort: string | null
    page: number
  }
  result: TransactionsResponse
}
