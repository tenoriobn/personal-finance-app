import { Context } from "hono";
import { themeService } from "./theme.service";
import { createThemeSchema } from "./theme.schema";
import { formatZodErrors } from "src/utils/format/formatZodErrors";

class ThemeController {
  async getAll(context: Context) {
    const themes = await themeService.getAll();
    return context.json(themes, 200);
  }

  async getThemesUsedInBudgets(context: Context) {
    const currentUser = context.get("user");
    const themes = await themeService.getThemesUsedInBudgets(currentUser);
    return context.json(themes, 200);
  }

  async getThemesAvailableForBudgets(context: Context) {
    const currentUser = context.get("user");
    const themes = await themeService.getThemesAvailableForBudgets(currentUser);
    return context.json(themes, 200);
  }

  async getThemesUsedInPots(context: Context) {
    const currentUser = context.get("user");
    const themes = await themeService.getThemesUsedInPots(currentUser);
    return context.json(themes, 200);
  }

  async getThemesAvailableForPots(context: Context) {
    const currentUser = context.get("user");
    const themes = await themeService.getThemesAvailableForPots(currentUser);
    return context.json(themes, 200);
  }

  async getById(context: Context) {
    const id = context.req.param("id");
    const theme = await themeService.getById(id);
    return context.json(theme, 200);
  }

  async create(context: Context) {
    const body = await context.req.json();

    const parsed = createThemeSchema.safeParse(body);
    if (!parsed.success) {
      return context.json({ error: formatZodErrors(parsed.error) }, 400);
    }

    const theme = await themeService.create(parsed.data);
    return context.json(theme, 201);
  }

  async update(context: Context) {
    const id = context.req.param("id");
    const body = await context.req.json();
    
    const parsed = createThemeSchema.partial().safeParse(body);
    if (!parsed.success) {
      return context.json({ error: formatZodErrors(parsed.error) }, 400);
    }

    const theme = await themeService.update(id, parsed.data);
    return context.json(theme, 200);
  }

  async delete(context: Context) {
    const id = context.req.param("id");
    await themeService.delete(id);
    return context.json({ message: "Tema removido com sucesso!" }, 200);
  }
}

export const themeController = new ThemeController();