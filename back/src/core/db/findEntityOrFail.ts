/* eslint-disable no-unused-vars */
import { AppError } from "@/src/utils";
import { isValidObjectId } from "src/utils/objectId/objectId";

/**
 * Versão simplificada do findOrFail.
 * Sem relação com controle de acesso.
 * Verifica se a entidade existe no banco, independente de quem está logado.
 */
export async function findEntityOrFail<T>(
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