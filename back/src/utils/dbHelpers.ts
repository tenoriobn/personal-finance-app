/* eslint-disable no-unused-vars */
import AppError from "./appError";
import { isValidObjectId } from "./objectId";

export async function getEntityOrFail<T>(
  model: { findUnique(args: object): Promise<T | null> }, 
  where: object, 
  notFoundMessage: string,
  options: { select?: object; include?: object } = {}
): Promise<T> {
  if ("id" in where) { 
    const id = (where as { id: string }).id;
    isValidObjectId(id);
  }

  const entity = await model.findUnique({ where, ...options });

  if (!entity) {
    throw new AppError(notFoundMessage, 404);
  }

  return entity;
}

export async function ensureUniqueOrFail<T>(
  model: { findFirst(args: object): Promise<T | null> },
  where: object,
  conflictMessage: string,
  excludeId?: string
): Promise<void> {
  if ("id" in where) { 
    isValidObjectId((where as { id: string }).id);
  }

  const query = {
    where: {
      ...where,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
  };

  const exists = await model.findFirst(query);
  
  if (exists) {
    throw new AppError(conflictMessage, 400);
  }
}