import { prisma } from "@/src/config/prisma";
import { BudgetEntityCheck, CreateBudgetDTO } from "./budget.type";
import { budgetSelect } from "./budget.select";
import { ensureUniqueOrFail, getEntityOrFail } from "@/src/utils/dbHelpers";

class BudgetService {  
  async getAll() {
    return prisma.budget.findMany({
      select: budgetSelect,
    });
  }

  async getById(id: string) {
    return await getEntityOrFail(prisma.budget, { id }, "Budget não encontrado!", { select: budgetSelect });
  }

  async create(data: CreateBudgetDTO) {
    const checks: BudgetEntityCheck[] = [
      [prisma.user, data.userId, "Usuário não encontrado!"],
      [prisma.theme, data.themeId, "Tema não encontrado!"],
      [prisma.category, data.categoryId, "Categoria não encontrada!"],
    ];

    for (const [model, id, message] of checks) {
      if (id) {
        await getEntityOrFail(model, { id }, message);
      }
    }

    if (data.themeId) {
      await ensureUniqueOrFail(prisma.budget, { themeId: data.themeId }, "O tema selecionado já está em uso.");
    }

    if (data.categoryId) {
      await ensureUniqueOrFail(prisma.budget, { categoryId: data.categoryId }, "Categoria já está em uso.");
    }

    return prisma.budget.create({ data });
  }

  async update(id: string, data: Partial<CreateBudgetDTO>) {
    await getEntityOrFail(prisma.budget, { id }, "Budget não encontrado!", { select: budgetSelect });

    const checks: BudgetEntityCheck[] = [
      [prisma.user, data.userId, "Usuário não encontrado!"],
      [prisma.theme, data.themeId, "Tema não encontrado!"],
      [prisma.category, data.categoryId, "Categoria não encontrada!"],
    ];

    for (const [model, id, message] of checks) {
      if (id) {
        await getEntityOrFail(model, { id }, message);
      }
    }

    if (data.themeId) {
      await ensureUniqueOrFail(prisma.budget, { themeId: data.themeId }, "O tema selecionado já está em uso.", id);
    }

    if (data.categoryId) {
      await ensureUniqueOrFail(prisma.budget, { categoryId: data.categoryId }, "Categoria já está em uso.", id);
    }

    return prisma.budget.update({ where: { id }, data });
  }

  async delete(id: string) {
    await getEntityOrFail(prisma.budget, { id }, "Budget não encontrado!");
    return prisma.budget.delete({ where: { id } });
  }
}

export const budgetService = new BudgetService();