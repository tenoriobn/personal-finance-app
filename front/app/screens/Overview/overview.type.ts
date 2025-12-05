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
  amountTransactionTotal: number
  budgets: {
    id: string
    theme: {
      colorHex: string
      colorName: string
    }
    category: {
      id: string
      name: string
    }
    transactions: {
      amount: number
    }[]
    maximumSpend: number
  }[]
}

export interface OverviewRecurringBill {
  dueSoon: number
  paidBills: number
  upcoming: number
}

export interface OverviewResponse {
  transactions: OverviewTransaction
  pots: OverviewPot
  budgets: OverviewBudget
  recurringBills: OverviewRecurringBill
}
