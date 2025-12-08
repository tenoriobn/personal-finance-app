import { z } from 'zod';

export const baseLoginSchema = z.object({
  email: z
    .string({ required_error: 'O campo \'email\' é obrigatório!' })
    .min(4, 'O e-mail deve ter pelo menos 4 caracteres')
    .email('Digite um email válido, ex: \'email@email.com\''),
  password: z
    .string({ required_error: 'O campo \'password\' é obrigatório!' }),
});

export type BaseLoginInput = z.infer<typeof baseLoginSchema>;
