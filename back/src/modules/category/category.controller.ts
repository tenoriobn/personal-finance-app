import type { Context } from "hono";
import { categoryService } from "./category.service";
import { formatZodErrors } from "@/src/utils/format/formatZodErrors";
import { createCategorySchema } from "./category.schema";

class CategoryController {
  async getAll(context: Context) {
    const categories = await categoryService.getAll();
    return context.json(categories, 200);
  }

  async getById(context: Context) {
    const id = context.req.param("id");
    const category = await categoryService.getById(id);
    return context.json(category, 200);
  }

  async create(context: Context) {
    const body = await context.req.json();

    const parsed = createCategorySchema.safeParse(body);

    if (!parsed.success) {
      return context.json({ error: formatZodErrors(parsed.error) }, 400);
    }

    const category = await categoryService.create(parsed.data);
    return context.json(category, 201);
  }

  async update(context: Context) {
    const id = context.req.param("id");
    const body = await context.req.json();

    const parsed = createCategorySchema.partial().safeParse(body);
    if (!parsed.success) {
      return context.json({ error: formatZodErrors(parsed.error) }, 400);
    }

    const category = await categoryService.update(id, parsed.data);
    return context.json(category, 200);
  }

  async delete(context: Context) {
    const id = context.req.param("id");
    await categoryService.delete(id);
    return context.json({ message: "Categoria removida com sucesso!" }, 200);
  }
}

export const categoryController = new CategoryController();