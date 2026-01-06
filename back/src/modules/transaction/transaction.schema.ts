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
    .refine(value => value !== 0, {
      message: "O valor não pode ser zero.",
    }),
  recurring: z.boolean({ required_error: "O campo 'recurring' é obrigatório!" }),
  budgetId: z.string({ required_error: "O campo 'budgetId' é obrigatório!" }),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;