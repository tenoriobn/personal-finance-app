/* eslint-disable no-unused-vars */
import { AppError } from "@/src/utils";

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