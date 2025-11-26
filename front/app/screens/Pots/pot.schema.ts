import { z } from 'zod';

export const basePotSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  targetAmount: z.number().min(1, 'O valor minimo é R$ 1,00'),
  themeId: z.string().nonempty('O tema é obrigatório!'),
});
export type BasePotInput = z.infer<typeof basePotSchema>;
