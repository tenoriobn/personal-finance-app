export interface CreateTransactionDTO {
  name: string;
  date: Date;
  amount: number;
  recurring: boolean;
  userId: string;
  budgetId: string;
}

export interface TransactionQuery {
  search?: string;
  categoryId?: string;
  sort?: string;
  page?: number;
  limit?: number;
}