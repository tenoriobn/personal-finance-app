import type { Context } from "hono";
import { overviewService } from "./overview.service";

class OverviewController {
  async getAll(context: Context) {
    const user = context.get("user");
    const query = context.req.query();

    const result = await overviewService.getAll(user, query);
    return context.json(result, 200);
  }
}

export const overviewController = new OverviewController();
