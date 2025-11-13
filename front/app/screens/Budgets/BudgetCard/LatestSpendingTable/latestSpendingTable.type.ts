import type { TransactionBudget } from '../../budgets.type';

export interface LatestSpendingTableProps {
  transactions: TransactionBudget[]
  categoryId: string
}
