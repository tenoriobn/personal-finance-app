import { z } from "zod";

export const createUserSchema = z.object({
  email: z
    .string({ required_error: "O campo 'email' é obrigatório!" })
    .min(4, "O e-mail deve ter pelo menos 4 caracteres")
    .email("Digite um email válido, ex: 'email@email.com'"),
  name: z
    .string({ required_error: "O campo 'name' é obrigatório!" })
    .min(3, "O nome deve ter pelo menos 3 caracteres"),
  password: z
    .string({ required_error: "O campo 'password' é obrigatório!" })
    // .regex(/[^a-zA-Z0-9]/, "A senha deve conter pelo menos um caractere especial")
    // .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    // .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    // .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
