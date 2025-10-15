/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { isValidObjectId } from "src/utils/objectId/objectId";
import { CurrentUserDTO } from "@/src/types/user.type";
import { FindOrFailOptions } from "./db.type";
import { AppError } from "@/src/utils";

/**
 * Busca uma entidade com suporte a controle de acesso.
 * Verifica se o recurso pertence ao usuário autenticado (via currentUser),
 * quando `checkOwnership` está habilitado.
 *
 * Ideal para entidades vinculadas a um usuário (ex: pot, budget, transaction, user).
 * Pode lançar erro de "Acesso negado" ou "Não encontrado".
 */
export async function findOrFail<T>(
  model: { findUnique(args: object): Promise<T | null> },
  where: object,
  currentUser: CurrentUserDTO,
  { select, include, checkOwnership = false, notFoundMessage }: FindOrFailOptions = {}
): Promise<T> {
  if ("id" in where) {
    const id = (where as { id: string }).id;
    isValidObjectId(id);
  }

  const entity = await model.findUnique({ where, select, include });

  if (!entity) {
    throw new AppError(notFoundMessage || "Recurso não encontrado!", 404);
  }

  if (checkOwnership && currentUser.role !== "ADMIN") {
    const ownerId = (entity as any).userId ?? (entity as any).id;
    
    if (ownerId !== currentUser.id) {
      throw new AppError("Acesso negado a este recurso.", 403);
    }
  }

  return entity;
}