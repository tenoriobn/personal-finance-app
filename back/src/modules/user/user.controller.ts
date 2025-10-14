import type { Context } from "hono";
import { userService } from "./user.service";
import { createUserSchema } from "./user.schema";
import { formatZodErrors } from "src/utils/formatZodErrors";

class UserController {
  async getAll(context: Context) {
    const currentUser = context.get("user");
    const users = await userService.getAll(currentUser);
    return context.json(users, 200);
  }

  async getById(context: Context) {
    const id = context.req.param("id");
    const currentUser = context.get("user");

    const user = await userService.getById(id, currentUser);
    return context.json(user, 200);
  }

  async update(context: Context) {
    const id = context.req.param("id");
    const currentUser = context.get("user");
    const body = await context.req.json();

    const parsed = createUserSchema.partial().safeParse(body);
    if (!parsed.success) {
      return context.json({ error: formatZodErrors(parsed.error) }, 400);
    }

    const user = await userService.update(id, parsed.data, currentUser);
    return context.json(user, 200);
  }

  async delete(context: Context) {
    const id = context.req.param("id");
    const currentUser = context.get("user");

    await userService.delete(id, currentUser);
    return context.json({ message: "Usuário removido com sucesso!" }, 200);
  }

  async updateRole(context: Context) {
    const id = context.req.param("id");
    const body = await context.req.json();
    const currentUser = context.get("user");

    const updated = await userService.updateRole(id, body.roleId, currentUser);
    return context.json(updated);
  }
}

export const userController = new UserController();
