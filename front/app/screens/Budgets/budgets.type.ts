export interface BudgetData {
  id: string
  maximumSpend: number
  category: Category
  theme: Theme
  transactions: TransactionBudget[]
}

export interface Category {
  id: string
  name: string
}

export interface Theme {
  id: string
  colorName: string
  colorHex: string
}

export interface TransactionBudget {
  id: string
  amount: number
  name: string
  budgetId: string
  date: string
  recurring: boolean
}
