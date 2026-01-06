import type { Context } from "hono";
import { overviewService } from "./overview.service";

class OverviewController {
  async getAll(context: Context) {
    const user = context.get("user");

    const result = await overviewService.getAll(user);
    return context.json(result, 200);
  }
}

export const overviewController = new OverviewController();
