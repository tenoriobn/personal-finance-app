export interface TransactionsData {
  id: string
  name: string
  date: string
  amount: number
  recurring: boolean
  userId: string
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
