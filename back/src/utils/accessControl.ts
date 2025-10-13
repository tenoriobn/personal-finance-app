import { CurrentUserDTO } from "../types/user.type";
import AppError from "./appError";

interface AccessContext {
  currentUser: CurrentUserDTO;
  resourceOwnerId?: string;
}

/**
 * Retorna o filtro apropriado para queries baseadas na role do usuário.
 * - Se ADMIN → retorna {}
 * - Se USER → retorna { id: currentUser.id }
 */

export function resolveAccessFilter({ currentUser, resourceOwnerId }: AccessContext) {
  const isAdmin = currentUser.role === "ADMIN";

  if (isAdmin) { return {}; }

  if (resourceOwnerId && resourceOwnerId !== currentUser.id) {
    throw new AppError("Acesso negado!", 403);
  }

  return { id: currentUser.id };
}
