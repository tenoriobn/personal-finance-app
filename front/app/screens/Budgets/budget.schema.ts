import { z } from 'zod';

export const baseBudgetSchema = z.object({
  maximumSpend: z.number().min(1, 'O valor minimo é R$ 1,00'),
  themeId: z.string().nonempty('O tema é obrigatório!'),
  categoryId: z.string().nonempty('A categoria é obrigatória!'),
});
export type BaseBudgetInput = z.infer<typeof baseBudgetSchema>;
