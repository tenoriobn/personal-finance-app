import type { BudgetData } from '../../budgets.type';

export interface EditBudgetModalProps {
  modelValue: boolean
  budget: BudgetData | null
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
