export interface OverviewTransaction {
  currentBalance: number
  income: number
  expenses: number
  transactions: {
    id: string
    name: string
    amount: number
    date: string
  }[]
}

export interface OverviewPot {
  totalPotsAmount: number
  pots: {
    id: string
    name: string
    theme: {
      colorHex: string
      colorName: string
    }
    totalAmount: number
  }[]
}

export interface OverviewBudget {
  id: string
  name: string
  spent: number
  limit: number
}

export interface OverviewRecurringBill {
  id: string
  name: string
  amount: number
  dueDate: string
}

export interface OverviewResponse {
  transactions: OverviewTransaction
  pots: OverviewPot
  budgets: OverviewBudget[]
  recurringBills: OverviewRecurringBill[]
}
