export interface MinimalBudget {
  maximumSpend: number
  category: { name: string }
  theme: { colorHex: string }
  transactions: { amount: number }[]
}
