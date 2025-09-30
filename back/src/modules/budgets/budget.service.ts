import { prisma } from "@/src/config/prisma";
import { CreateBudgetDTO } from "./budget.type";
import { isValidObjectId } from "@/src/utils/objectId";
import AppError from "@/src/utils/appError";

class BudgetService {
  private async getBudgetOrFail(id: string) {
    if (!isValidObjectId(id)) {
      throw new AppError("Formato de ID inválido!", 400);
    }
        
    const budget = await prisma.budget.findUnique({ where: { id } });

    if (!budget) {
      throw new AppError("Budget não encontrado!", 404);
    }

    return budget;
  }

  private async getUserOrFail(id: string) {
    if (!isValidObjectId(id)) {
      throw new AppError("Formato de ID inválido!", 400);
    }
        
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError("Usuário não encontrado!", 404);
    }

    return user;
  }

  private async ensureUniqueName(themeId?: string, categoryId?: string, excludeId?: string) {
    if ([themeId, categoryId].some(id => id && !isValidObjectId(id))) {
      throw new AppError("Formato de ID inválido!", 400);
    }

    const theme = themeId ? await prisma.theme.findUnique({ where: { id: themeId } }) : null;

    if (themeId && !theme) {
      throw new AppError("Tema não encontrado!", 404);
    }

    const category = categoryId && await prisma.category.findUnique({ where: { id: categoryId } });

    if (categoryId && !category) {
      throw new AppError("Categoria não encontrada!", 404);
    }

    const budget = await prisma.budget.findFirst({
      where: {
        OR: [
          { categoryId },
          { themeId }
        ],
        NOT: excludeId ? { id: excludeId } : undefined,
      }
    });

    if (budget) {
      const errorMsg = budget.categoryId === categoryId ? "Categoria já está em uso." : "O tema selecionado já está em uso.";
      throw new AppError(errorMsg, 409);
    }
  }

  async getAll() {
    return prisma.budget.findMany();
  }

  async getById(id: string) {
    return this.getBudgetOrFail(id);
  }

  async create(data: CreateBudgetDTO) {
    await this.getUserOrFail(data.userId);
    await this.ensureUniqueName(data.themeId, data.categoryId);

    return prisma.budget.create({ data });
  }

  async update(id: string, data: Partial<CreateBudgetDTO>) {
    await this.getBudgetOrFail(id);

    if (data.userId) {
      await this.getUserOrFail(data.userId);
    }

    if (data.themeId || data.categoryId) {
      await this.ensureUniqueName(data.themeId, data.categoryId, id);
    }

    return prisma.budget.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.getBudgetOrFail(id);
    return prisma.budget.delete({ where: { id } });
  }
}

export const budgetService = new BudgetService();