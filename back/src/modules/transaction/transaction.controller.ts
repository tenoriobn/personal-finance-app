import type { Context } from "hono";
import { transactionService } from "./transaction.service";
import { formatZodErrors } from "src/utils/formatZodErrors";
import { createTransactionSchema } from "./transaction.schema";

class TransactionController {
  async getAll(context: Context) {
    const { id: userId } = context.get("user");

    const transactions = await transactionService.getAll(userId);
    return context.json(transactions, 200);
  }

  async getById(context: Context) {
    const id = context.req.param("id");
    const { id: userId } = context.get("user");

    const transaction = await transactionService.getById(id, userId);
    return context.json(transaction, 200);
  }

  async create(context: Context) {
    const body = await context.req.json();
    const { id: userId } = context.get("user");

    const parsed = createTransactionSchema.safeParse(body);

    if (!parsed.success) {
      return context.json({ error: formatZodErrors(parsed.error) }, 400);
    }

    const transaction = await transactionService.create(parsed.data, userId);
    return context.json(transaction, 201);
  }

  async update(context: Context) {
    const id = context.req.param("id");
    const { id: userId } = context.get("user");
    const body = await context.req.json();

    const parsed = createTransactionSchema.partial().strict().safeParse(body);
    if (!parsed.success) {
      return context.json({ error: formatZodErrors(parsed.error) }, 400);
    }

    const transaction = await transactionService.update(id, parsed.data, userId);
    return context.json(transaction, 200);
  }

  async delete(context: Context) {
    const id = context.req.param("id");
    const { id: userId } = context.get("user");
    await transactionService.delete(id, userId);
    return context.json({ message: "Transaction removido com sucesso!" }, 200);
  }
}

export const transactionController = new TransactionController();