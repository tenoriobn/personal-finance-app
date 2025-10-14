import { prisma } from "@/src/config/prisma";
import { BudgetEntityCheck, CreateBudgetDTO } from "./budget.type";
import { budgetSelect } from "./budget.select";
import { ensureUniqueOrFail, getEntityOrFail } from "@/src/utils/dbHelpers";
import { CurrentUserDTO } from "@/src/types/user.type";
import { resolveAccessFilter } from "@/src/utils/accessControl";

class BudgetService {  
  async getAll(currentUser: CurrentUserDTO) {
    const where = resolveAccessFilter({ currentUser });

    return prisma.budget.findMany({
      where,
      select: budgetSelect,
    });
  }

  async getById(id: string, currentUser: CurrentUserDTO) {
    const where = resolveAccessFilter({ currentUser, resourceOwnerId: id });

    return await getEntityOrFail(prisma.budget, { id, userId: where }, "Budget não encontrado!", { select: budgetSelect });
  }

  async create(data: CreateBudgetDTO, currentUser: CurrentUserDTO) {
    resolveAccessFilter({ currentUser, resourceOwnerId: data.userId });

    const checks: BudgetEntityCheck[] = [
      [prisma.user, currentUser.id, "Usuário não encontrado!"],
      [prisma.theme, data.themeId, "Tema não encontrado!"],
      [prisma.category, data.categoryId, "Categoria não encontrada!"],
    ];

    for (const [model, id, message] of checks) {
      if (id) {
        await getEntityOrFail(model, { id }, message);
      }
    }

    if (data.themeId) {
      await ensureUniqueOrFail(prisma.budget, { themeId: data.themeId, userId: data.userId }, "O tema selecionado já está em uso.");
    }

    if (data.categoryId) {
      await ensureUniqueOrFail(prisma.budget, { categoryId: data.categoryId, userId: data.userId }, "Categoria já está em uso.");
    }

    return prisma.budget.create({ data });
  }

  async update(id: string, data: Partial<CreateBudgetDTO>, currentUser: CurrentUserDTO) {
    resolveAccessFilter({ currentUser, resourceOwnerId: id });

    await getEntityOrFail(prisma.budget, { id }, "Budget não encontrado!", { select: budgetSelect });

    const checks: BudgetEntityCheck[] = [
      [prisma.user, currentUser.id, "Usuário não encontrado!"],
      [prisma.theme, data.themeId, "Tema não encontrado!"],
      [prisma.category, data.categoryId, "Categoria não encontrada!"],
    ];

    for (const [model, id, message] of checks) {
      if (id) {
        await getEntityOrFail(model, { id }, message);
      }
    }

    if (data.themeId) {
      await ensureUniqueOrFail(prisma.budget, { themeId: data.themeId, userId: data.userId }, "O tema selecionado já está em uso.", id);
    }

    if (data.categoryId) {
      await ensureUniqueOrFail(prisma.budget, { categoryId: data.categoryId, userId: data.userId }, "Categoria já está em uso.", id);
    }

    return prisma.budget.update({ where: { id }, data });
  }

  async delete(id: string, currentUser: CurrentUserDTO) {
    resolveAccessFilter({ currentUser, resourceOwnerId: id });

    await getEntityOrFail(prisma.budget, { id }, "Budget não encontrado!");
    return prisma.budget.delete({ where: { id } });
  }
}

export const budgetService = new BudgetService();