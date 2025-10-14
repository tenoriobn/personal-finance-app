import { Context } from "hono";
import { authService } from "./auth.service";
import { createAuthSchema } from "./auth.schema";
import { formatZodErrors } from "@/src/utils/formatZodErrors";
import { createUserSchema } from "../user/user.schema";

class AuthController {
  async create(context: Context) {
    const body = await context.req.json();

    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return context.json({ error: formatZodErrors(parsed.error) }, 400);
    }

    const user = await authService.create(parsed.data);
    return context.json(user, 201);
  }

  async login(context: Context) {
    const { email, password } = await context.req.json();

    const parsed = createAuthSchema.safeParse({ email, password });

    if (!parsed.success) {
      return context.json({ error: formatZodErrors(parsed.error) }, 400);
    }

    const result = await authService.login(email, password);

    return context.json(result);
  }
}

export const authController = new AuthController();