import { z } from 'zod';

export const createTransactionSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  date: z.string().nonempty('A data é obrigatória.'),
  amount: z
    .number({ required_error: 'O campo \'amount\' é obrigatório!' })
    .refine(value => value !== 0, {
      message: 'O valor não pode ser zero.',
    }),
  budgetId: z.string().nonempty('Selecione uma categoria.'),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
