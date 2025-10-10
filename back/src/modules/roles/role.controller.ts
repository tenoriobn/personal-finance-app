import { Context } from "hono";
import { roleService } from "./role.service";
import { createRoleSchema } from "./role.schema";
import { formatZodErrors } from "@/src/utils/formatZodErrors";

export const roleController = {
  async findAll(context: Context) {
    const roles = await roleService.findAll();
    return context.json(roles);
  },

  async getById(context: Context) {
    const id = context.req.param("id");
    const role = await roleService.getById(id);
    return context.json(role, 200);
  },

  async create(context: Context) {
    const body = await context.req.json();

    const parsed = createRoleSchema.safeParse(body);
    if (!parsed.success) {
      return context.json({ error: formatZodErrors(parsed.error) }, 400);
    }

    const role = await roleService.create(parsed.data);

    return context.json(role, 201);
  },

  async update(context: Context) {
    const id = context.req.param("id");
    const body = await context.req.json();

    const parsed = createRoleSchema.partial().safeParse(body);
    if (!parsed.success) {
      return context.json({ error: formatZodErrors(parsed.error) }, 400);
    }

    const role = await roleService.update(id, parsed.data);
    return context.json(role, 200);
  },

  async delete(context: Context) {
    const id = context.req.param("id");
    await roleService.delete(id);
    return context.json({ message: "Role removida com sucesso" }, 200);
  },
};
