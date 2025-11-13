export interface LatestSpendingTableProps {
  transactions: TransactionsData[]
  categoryId: string
}

export interface TransactionsData {
  id: string
  name: string
  date: string
  amount: number
  budgetId: string
}
