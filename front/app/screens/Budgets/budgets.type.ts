export interface BudgetData {
  id: string
  maximumSpend: number
  category: CategoryData
  theme: ThemeData
  transactions: TransactionBudget[]
}

export interface CategoryData {
  id: string
  name: string
  budgetId: string
}

export interface ThemeData {
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

export interface BudgetForm {
  maximumSpend: number
  categoryId: string
  themeId: string
}
