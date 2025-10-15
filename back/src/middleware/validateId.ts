import { Context, Next } from "hono";
import { isValidObjectId } from "../utils/objectId/objectId";

export const validateId = async (context: Context, next: Next) => {
  const id = context.req.param("id");

  isValidObjectId(id);

  await next();
};
