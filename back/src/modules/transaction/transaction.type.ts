export interface CreateTransactionDTO {
  name: string;
  date: Date;
  amount: number;
  recurring: boolean;
  userId: string;
  budgetId: string;
}
