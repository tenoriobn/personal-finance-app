import type { Context } from "hono";
import { userService } from "./user.service";
import { createUserSchema } from "./user.schema";
import { formatZodErrors } from "src/utils/formatZodErrors";

class UserController {
  async getAll(context: Context) {
    const users = await userService.getAll();
    return context.json(users, 200);
  }

  async getById(context: Context) {
    const id = context.req.param("id");
    const user = await userService.getById(id);
    return context.json(user, 200);
  }

  async create(context: Context) {
    const body = await context.req.json();

    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return context.json({ error: formatZodErrors(parsed.error) }, 400);
    }

    const user = await userService.create(parsed.data);
    return context.json(user, 201);
  }

  async update(context: Context) {
    const id = context.req.param("id");
    const body = await context.req.json();

    const parsed = createUserSchema.partial().safeParse(body);
    if (!parsed.success) {
      return context.json({ error: formatZodErrors(parsed.error) }, 400);
    }

    const user = await userService.update(id, parsed.data);
    return context.json(user, 200);
  }

  async delete(context: Context) {
    const id = context.req.param("id");
    await userService.delete(id);
    return context.json({ message: "Usuário removido com sucesso!" }, 200);
  }
}

export const userController = new UserController();
