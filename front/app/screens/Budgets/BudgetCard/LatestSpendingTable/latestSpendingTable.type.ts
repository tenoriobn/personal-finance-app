export interface LatestSpendingTableProps {
  transactions: TransactionsData[]
}

export interface TransactionsData {
  id: string
  name: string
  date: string
  amount: number
  budgetId: string
}
