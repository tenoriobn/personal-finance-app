import { ObjectId } from "mongodb";
import AppError from "./appError";

/**
 * Verifica se uma string é um ObjectId válido, de acordo com o MongoDB.
 */

export const isValidObjectId = (id: string): boolean => {
  if (!ObjectId.isValid(id)) {
    throw new AppError("Formato de ID inválido", 400);
  }

  return ObjectId.isValid(id);
};
