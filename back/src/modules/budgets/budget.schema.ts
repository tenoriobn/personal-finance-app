import { z } from "zod";

export const createBudgetSchema = z.object({
  maximumSpend: z
    .number({ required_error: "O campo 'maximumSpend' é obrigatório!" })
    .positive("O valor deve ser positivo")
    .min(1, "O valor deve ser maior ou igual a 1"),
  themeId: z.string({ required_error: "O campo 'themeId' é obrigatório!" }),
  categoryId: z.string({ required_error: "O campo 'categoryId' é obrigatório!" }),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;