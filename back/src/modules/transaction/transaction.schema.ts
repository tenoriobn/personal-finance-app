import { z } from "zod";

export const createTransactionSchema = z.object({
  name: z
    .string({ required_error: "O campo 'name' é obrigatório!" })
    .min(3, "O nome deve ter pelo menos 3 caracteres"),
  date: z.preprocess((arg) => {
    if (typeof arg === "string" || typeof arg === "number") {
      const date = new Date(arg);
      if (!isNaN(date.getTime())) { return date; }
    }
    return arg;
  }, z.date({ required_error: "O campo 'date' é obrigatório!" })),
  amount: z
    .number({ required_error: "O campo 'amount' é obrigatório!" })
    .positive("O valor deve ser positivo")
    .min(1, "O valor deve ser maior ou igual a 1"),
  recurring: z.boolean({ required_error: "O campo 'recurring' é obrigatório!" }),
  userId: z.string({ required_error: "O campo 'userId' é obrigatório!" }),
  budgetId: z.string({ required_error: "O campo 'budgetId' é obrigatório!" }),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;