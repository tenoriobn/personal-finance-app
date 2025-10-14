import { Context, Next } from "hono";
import { verifyToken } from "../utils/jwt";
import AppError from "../utils/appError";

export async function authentication(context: Context, next: Next) {
  const authHeader = context.req.header("Authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Token não fornecido!", 401);
  }

  const token = authHeader.replace("Bearer ", "");
  
  try {
    const user = verifyToken(token);

    context.set("user", user);
    await next();
  } catch {
    throw new AppError("Token inválido!", 401);
  }
}