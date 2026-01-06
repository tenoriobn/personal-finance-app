export interface TransactionsData {
  id: string
  name: string
  date: string
  amount: number
  recurring: boolean
  budget: {
    category: {
      id: string
      name: string
    }
  }
}

export type TransactionsResponse = {
  data: TransactionsData[]
  totalPages: number
};
