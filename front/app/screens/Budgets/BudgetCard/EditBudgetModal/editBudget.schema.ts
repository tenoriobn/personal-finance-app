import { z } from 'zod';

export const EditBudgetSchema = z.object({
  maximumSpend: z.number().min(1, 'O valor minimo é R$ 1,00'),
  themeId: z.string().nonempty('O tema é obrigatório!'),
  categoryId: z.string().nonempty('A categoria é obrigatória!'),
});

export type EditBudgetInput = z.infer<typeof EditBudgetSchema>;
