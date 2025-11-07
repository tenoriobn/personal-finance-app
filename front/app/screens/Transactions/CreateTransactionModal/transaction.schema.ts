import { z } from 'zod';

export const createTransactionSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  date: z.string().nonempty('A data é obrigatória.'),
  amount: z.number().min(1, 'O valor minimo é R$ 1,00'),
  budgetId: z.string().nonempty('Selecione uma categoria.'),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
