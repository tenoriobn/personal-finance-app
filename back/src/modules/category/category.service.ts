import { prisma } from "src/config/prisma";
import { CreateCategoryDTO } from "./category.type";
import { ensureUniqueOrFail, findEntityOrFail } from "src/core";
import { CurrentUserDTO } from "@/types/user.type";

class CategoryService {
  async getAll() {
    return prisma.category.findMany();
  }

  async getUsedCategories(currentUser: CurrentUserDTO) {
    const categories = await prisma.category.findMany({
      where: {
        budgets: {
          some: { userId: currentUser.id },
        },
      },
      select: { 
        id: true, 
        name: true,
        budgets: {
          where: { userId: currentUser.id },
          select: { id: true },
          take: 1,
        },
      },
    });

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      budgetId: category.budgets[0]?.id ?? null,
    }));
  }

  async getAvailableCategories(currentUser: CurrentUserDTO) {
    return prisma.category.findMany({
      where: {
        budgets: {
          none: { userId: currentUser.id },
        },
      },
      select: { id: true, name: true },
    });
  }

  async getById(id: string) {
    return await findEntityOrFail(
      prisma.category,
      { id },
      "Categoria não encontrada!"
    );
  }

  async create(data: CreateCategoryDTO) {
    await ensureUniqueOrFail(prisma.category, { name: data.name }, "Categoria já está em uso.");
    return prisma.category.create({ data });
  }

  async update(id: string, data: Partial<CreateCategoryDTO>) {
    await findEntityOrFail(prisma.category, { id }, "Categoria não encontrada!");

    if (data.name) {
      await ensureUniqueOrFail(prisma.category, { name: data.name }, "Categoria já está em uso.", id);
    }
    
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    await findEntityOrFail(prisma.category, { id }, "Categoria não encontrada!");
    return prisma.category.delete({ where: { id } });
  }
}

export const categoryService = new CategoryService();