import { prisma } from "@/src/config/prisma";
import { CreateCategoryDTO } from "./category.type";
import AppError from "@/src/utils/appError";

class CategoryService {
  private async getCategoryOrFail(id: string) {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new AppError("Usuário não encontrado!", 404);
    }

    return category;
  }

  private async ensureUniqueName(name: string, excludeId?: string) {
    const category = await prisma.category.findFirst({
      where: {
        name,
        NOT: excludeId ? { id: excludeId } : undefined,
      },
    });

    if (category) {
      throw new AppError("Categoria já cadastrada!", 409);
    }
  }

  async getAll() {
    return prisma.category.findMany();
  }

  async getById(id: string) {
    return this.getCategoryOrFail(id);
  }

  async create(data: CreateCategoryDTO) {
    await this.ensureUniqueName(data.name);
    return prisma.category.create({ data });
  }

  async update(id: string, data: Partial<CreateCategoryDTO>) {
    await this.getCategoryOrFail(id);

    if (data.name) {
      await this.ensureUniqueName(data.name, id);
    }
    
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.getCategoryOrFail(id);
    return prisma.category.delete({ where: { id } });
  }
}

export const categoryService = new CategoryService();