export interface CreateTransactionModalProps {
  modelValue: boolean
}

export interface TransactionForm {
  name: string
  date: string
  amount: number
  recurring: boolean
  budgetId: string
  userId: string
}

export interface CategoryData {
  id: string
  name: string
  budgetId: string
}
