import { z } from "zod";

export const createPotSchema = z.object({
  name: z
    .string({ required_error: "O campo 'name' é obrigatório!" })
    .min(3, "O nome deve ter pelo menos 3 caracteres"),
  targetAmount: z
    .number({ required_error: "O campo 'targetAmount' é obrigatório!" })
    .positive("O valor deve ser positivo")
    .min(1, "O valor deve ser maior ou igual a 1"),
  totalAmount: z
    .number({ required_error: "O campo 'totalAmount' é obrigatório!" }),
  userId: z.string({ required_error: "O campo 'userId' é obrigatório!" }),
  themeId: z.string({ required_error: "O campo 'themeId' é obrigatório!" }),
});

export type CreatePotInput = z.infer<typeof createPotSchema>;