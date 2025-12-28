// app/utils/finance/finance.types.ts

export interface AmountItem {
  amount: number
}

export type SpendInput = number | Array<AmountItem | undefined>;
