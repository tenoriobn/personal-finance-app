import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string({ required_error: "O campo 'name' é obrigatório!" })
    .min(3, "O nome deve ter pelo menos 3 caracteres"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;