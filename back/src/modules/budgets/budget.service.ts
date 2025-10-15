import { prisma } from "@/src/config/prisma";
import { BudgetEntityCheck, CreateBudgetDTO } from "./budget.type";
import { budgetSelect } from "./budget.select";
import { ensureUniqueOrFail, findOrFail } from "@/src/utils/dbHelpers";
import { CurrentUserDTO } from "@/src/types/user.type";

class BudgetService {  
  async getAll(currentUser: CurrentUserDTO) {
    const where = currentUser.role === "ADMIN" ? {} : { userId: currentUser.id };

    return prisma.budget.findMany({
      where,
      select: budgetSelect,
    });
  }

  async getById(id: string, currentUser: CurrentUserDTO) {    
    return findOrFail(
      prisma.budget,
      { id },
      currentUser,
      { select: budgetSelect, checkOwnership: true, notFoundMessage: "Budget não encontrado!" }
    );
  }

  async create(data: CreateBudgetDTO, currentUser: CurrentUserDTO) {
    const checks: BudgetEntityCheck[] = [
      [prisma.user, currentUser.id, "Usuário não encontrado!"],
      [prisma.theme, data.themeId, "Tema não encontrado!"],
      [prisma.category, data.categoryId, "Categoria não encontrada!"],
    ];

    for (const [model, id, message] of checks) {
      if (id) { await findOrFail(model, { id }, currentUser, { notFoundMessage: message }); }
    }

    if (data.themeId) {
      await ensureUniqueOrFail(
        prisma.budget,
        { themeId: data.themeId, userId: currentUser.id },
        "O tema selecionado já está em uso."
      );
    }

    if (data.categoryId) {
      await ensureUniqueOrFail(
        prisma.budget,
        { categoryId: data.categoryId, userId: currentUser.id },
        "Categoria já está em uso."
      );
    }

    const payload = { ...data, userId: currentUser.id };

    return prisma.budget.create({ data: payload });
  }

  async update(id: string, data: Partial<CreateBudgetDTO>, currentUser: CurrentUserDTO) {
    await findOrFail(
      prisma.budget,
      { id },
      currentUser,
      { checkOwnership: true, notFoundMessage: "Budget não encontrado!" }
    );

    const checks: BudgetEntityCheck[] = [
      [prisma.user, currentUser.id, "Usuário não encontrado!"],
      [prisma.theme, data.themeId, "Tema não encontrado!"],
      [prisma.category, data.categoryId, "Categoria não encontrada!"],
    ];

    for (const [model, id, message] of checks) {
      if (id) {await findOrFail(model, { id }, currentUser, { notFoundMessage: message });}
    }

    if (data.themeId) {
      await ensureUniqueOrFail(
        prisma.budget,
        { themeId: data.themeId, userId: currentUser.id },
        "O tema selecionado já está em uso.",
        id
      );
    }

    if (data.categoryId) {
      await ensureUniqueOrFail(
        prisma.budget,
        { categoryId: data.categoryId, userId: currentUser.id },
        "Categoria já está em uso.",
        id
      );
    }

    const payload = { ...data, userId: currentUser.id };

    return prisma.budget.update({ where: { id }, data: payload });
  }

  async delete(id: string, currentUser: CurrentUserDTO) {
    await findOrFail(
      prisma.budget,
      { id },
      currentUser,
      { checkOwnership: true, notFoundMessage: "Budget não encontrado!" }
    );

    return prisma.budget.delete({ where: { id } });
  }
}

export const budgetService = new BudgetService();