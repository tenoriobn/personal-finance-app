import type { Context } from "hono";
import { transactionService } from "./transaction.service";
import { formatZodErrors } from "src/utils/formatZodErrors";
import { createTransactionSchema } from "./transaction.schema";

class TransactionController {
  async getAll(context: Context) {
    const transactions = await transactionService.getAll();
    return context.json(transactions, 200);
  }

  async getById(context: Context) {
    const id = context.req.param("id");
    const transaction = await transactionService.getById(id);
    return context.json(transaction, 200);
  }

  async create(context: Context) {
    const body = await context.req.json();

    const parsed = createTransactionSchema.safeParse(body);

    if (!parsed.success) {
      return context.json({ error: formatZodErrors(parsed.error) }, 400);
    }

    const transaction = await transactionService.create(parsed.data);
    return context.json(transaction, 201);
  }

  async update(context: Context) {
    const id = context.req.param("id");
    const body = await context.req.json();

    const parsed = createTransactionSchema.partial().strict().safeParse(body);
    if (!parsed.success) {
      return context.json({ error: formatZodErrors(parsed.error) }, 400);
    }

    const transaction = await transactionService.update(id, parsed.data);
    return context.json(transaction, 200);
  }

  async delete(context: Context) {
    const id = context.req.param("id");
    await transactionService.delete(id);
    return context.json({ message: "Budget removido com sucesso!" }, 200);
  }
}

export const transactionController = new TransactionController();