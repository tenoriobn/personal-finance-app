import z from "zod";

export const createAuthSchema = z.object({
  email: z
    .string({ required_error: "O campo 'email' é obrigatório!" })
    .email("Digite um email válido, ex: 'email@email.com'"),
  password: z
    .string({ required_error: "O campo 'password' é obrigatório!" })
});

export type CreateAuthInput = z.infer<typeof createAuthSchema>;