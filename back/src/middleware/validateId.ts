import { Context, Next } from "hono";
import { ObjectId } from "mongodb";
import AppError from "src/utils/appError";

export const validateId = async (context: Context, next: Next) => {
  const id = context.req.param("id");

  if (!ObjectId.isValid(id)) {
    throw new AppError("Formato de ID inválido", 400);
  }

  await next();
};
