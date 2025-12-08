import { z } from 'zod';

export const baseRegisterSchema = z.object({
  name: z
    .string({ required_error: 'O campo \'name\' é obrigatório!' })
    .min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z
    .string({ required_error: 'O campo \'email\' é obrigatório!' })
    .min(4, 'O e-mail deve ter pelo menos 4 caracteres')
    .email('Digite um email válido, ex: \'email@email.com\''),
  password: z
    .string({ required_error: 'O campo \'password\' é obrigatório!' })
    .regex(/[^a-zA-Z0-9]/, 'A senha deve conter pelo menos um caractere especial')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
    .min(8, 'A senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z
    .string({ required_error: 'O campo \'confirmPassword\' é obrigatório!' })
    .min(1, 'Confirme sua senha'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type BaseRegisterInput = z.infer<typeof baseRegisterSchema>;
