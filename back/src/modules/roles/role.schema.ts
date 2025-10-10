import { z } from "zod";

export const createRoleSchema = z.object({
  name: z
    .string({ required_error: "O campo 'name' é obrigatório!" })
    .min(3, "O nome deve ter pelo menos 3 caracteres"),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
