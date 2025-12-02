import type { Context } from "hono";
import { recurringBillsService } from "./recurringBills.service";

class RecurringBillsController {
  async getAll(context: Context) {
    const user = context.get("user");
    const query = context.req.query();

    const result = await recurringBillsService.getAll(user, query);
    return context.json(result, 200);
  }
}

export const recurringBillsController = new RecurringBillsController();
