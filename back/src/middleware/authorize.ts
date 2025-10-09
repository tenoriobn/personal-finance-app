import { Context, Next } from "hono";
import AppError from "src/utils/appError";

export function authorize(roles: ("USER" | "ADMIN")[]) {
  return async (context: Context, next: Next) => {
    const user = context.get("user");

    if (!roles.includes(user.role)) {
      throw new AppError("Acesso negado!", 403);
    }

    await next();
  };
}
