/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "./appError";
import { isValidObjectId } from "./objectId";

export async function getEntityOrFail<T>(
  model: { 
    findUnique: (args: any) => Promise<T | null> 
  }, 
  where: any, 
  notFoundMessage: string,
  options: { select?: any; include?: any } = {}
): Promise<T> {
  if (where.id) { 
    isValidObjectId(where.id);
  }

  const entity = await model.findUnique({ where, ...options });

  if (!entity) {
    throw new AppError(notFoundMessage, 404);
  }

  return entity;
}

export async function ensureUniqueOrFail<T>(
  model: { findFirst: (args: any) => Promise<T | null> },
  where: any,
  conflictMessage: string,
  excludeId?: string
): Promise<void> {
  if (where.id) { 
    isValidObjectId(where.id);
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