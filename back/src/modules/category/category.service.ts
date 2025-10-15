import { prisma } from "@/src/config/prisma";
import { CreateCategoryDTO } from "./category.type";
import { ensureUniqueOrFail, findEntityOrFail } from "@/src/core";

class CategoryService {
  async getAll() {
    return prisma.category.findMany();
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