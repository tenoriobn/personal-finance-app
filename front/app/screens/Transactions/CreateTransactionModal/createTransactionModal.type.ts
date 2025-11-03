export interface CreateTransactionModalProps {
  modelValue: boolean
}

export interface TransactionForm {
  name: string
  date: string | null
  amount: number
  recurring: boolean
  category: string | null
}
