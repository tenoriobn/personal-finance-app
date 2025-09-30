import { z } from "zod";

export const createBudgetSchema = z.object({
  maximumSpend: z
    .number({ required_error: "O campo 'maximumSpend' é obrigatório!" })
    .min(1, "O valor deve ser maior ou igual a 1"),
  userId: z.string({ required_error: "O campo 'userId' é obrigatório!" }),
  themeId: z.string({ required_error: "O campo 'themeId' é obrigatório!" }),
  categoryId: z.string({ required_error: "O campo 'categoryId' é obrigatório!" }),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;