export interface CreateBudgetModalProps {
  modelValue: boolean
}

export interface BudgetForm {
  maximumSpend: number
  categoryId: string
  themeId: string
  userId: string
}

export interface CategoryData {
  id: string
  name: string
  budgetId: string
}

export interface ThemeData {
  id: string
  colorName: string
}
