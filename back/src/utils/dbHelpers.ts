/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import AppError from "./appError";
import { isValidObjectId } from "./objectId";
import { CurrentUserDTO } from "@/src/types/user.type";

interface FindOrFailOptions {
  select?: object;
  include?: object;
  checkOwnership?: boolean; // força verificar se pertence ao usuário
  notFoundMessage?: string;
}

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

/**
 * Garante que não exista outro registro com os mesmos valores especificados.
 * Usado para prevenir duplicidades em campos únicos (ex: e-mail, nome, themeId).
 *
 * Pode receber um `excludeId` para ignorar o próprio registro em atualizações.
 * Lança erro 400 (Bad Request) caso o valor já exista.
 */
export async function ensureUniqueOrFail<T>(
  model: { findFirst(args: object): Promise<T | null> },
  where: object,
  conflictMessage: string,
  excludeId?: string
): Promise<void> {
  const query = {
    where: {
      ...where,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
  };

  const exists = await model.findFirst(query);
  if (exists){ throw new AppError(conflictMessage, 400); };
}

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