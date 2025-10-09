import { Context } from "hono";
import { potService } from "./pot.service";
import { formatZodErrors } from "@/src/utils/formatZodErrors";
import { createPotSchema } from "./pot.schema";

class PotController {
  async getAll(context: Context) {
    const { id: userId } = context.get("user");
    const pots = await potService.getAll(userId);
    return context.json(pots, 200);
  }

  async getById(context: Context) {
    const id = context.req.param("id");
    const { id: userId } = context.get("user");
    const pot = await potService.getById(id, userId);
    return context.json(pot, 200);
  }
  

  async create(context: Context) {
    const body = await context.req.json();
    const { id: userId } = context.get("user");

    const parsed = createPotSchema.safeParse(body);

    if (!parsed.success) {
      return context.json({ error: formatZodErrors(parsed.error) }, 400);
    }

    const pot = await potService.create(parsed.data, userId);
    return context.json(pot, 201);
  }

  async update(context: Context) {
    const id = context.req.param("id");
    const { id: userId } = context.get("user");
    const body = await context.req.json();

    const parsed = createPotSchema.partial().safeParse(body);
    if (!parsed.success) {
      return context.json({ error: formatZodErrors(parsed.error) }, 400);
    }

    const pot = await potService.update(id, parsed.data, userId);
    return context.json(pot, 200);
  }

  async delete(context: Context) {
    const id = context.req.param("id");
    const { id: userId } = context.get("user");
    await potService.delete(id, userId);
    return context.json({ message: "POT removido com sucesso!" }, 200);
  }
}

export const potController = new PotController();