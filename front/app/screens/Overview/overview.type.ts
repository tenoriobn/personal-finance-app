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
  id: string
  name: string
  theme: string
  totalAmount: number
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
  pots: OverviewPot[]
  budgets: OverviewBudget[]
  recurringBills: OverviewRecurringBill[]
}
