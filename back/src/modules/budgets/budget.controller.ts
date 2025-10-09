import type { Context } from "hono";
import { budgetService } from "./budget.service";
import { formatZodErrors } from "src/utils/formatZodErrors";
import { createBudgetSchema } from "./budget.schema";

class BudgetController {
  async getAll(context: Context) {
    const { id: userId } = context.get("user");
    const budgets = await budgetService.getAll(userId);
    return context.json(budgets, 200);
  }

  async getById(context: Context) {
    const id = context.req.param("id");
    const { id: userId } = context.get("user");
    const budget = await budgetService.getById(id, userId);
    return context.json(budget, 200);
  }

  async create(context: Context) {
    const body = await context.req.json();
    const { id: userId } = context.get("user");

    const parsed = createBudgetSchema.safeParse(body);

    if (!parsed.success) {
      return context.json({ error: formatZodErrors(parsed.error) }, 400);
    }

    const budget = await budgetService.create(parsed.data, userId);
    return context.json(budget, 201);
  }

  async update(context: Context) {
    const id = context.req.param("id");
    const { id: userId } = context.get("user");
    const body = await context.req.json();

    const parsed = createBudgetSchema.partial().safeParse(body);
    if (!parsed.success) {
      return context.json({ error: formatZodErrors(parsed.error) }, 400);
    }

    const budget = await budgetService.update(id, parsed.data, userId);
    return context.json(budget, 200);
  }

  async delete(context: Context) {
    const id = context.req.param("id");
    const { id: userId } = context.get("user");
    await budgetService.delete(id, userId);
    return context.json({ message: "Budget removido com sucesso!" }, 200);
  }
}

export const budgetController = new BudgetController();