import { prisma } from "src/config/prisma";
import type { CreateUserDTO } from "./user.types";
import AppError from "src/utils/appError";

class UserService {
  private async getUserOrFail(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError("Usuário não encontrado!", 404);
    }

    return user;
  }

  private async ensureUniqueEmail(email: string, excludeId?: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
        NOT: excludeId ? { id: excludeId } : undefined,
      },
    });

    if (user) {
      throw new AppError("E-mail já cadastrada!", 409);
    }
  }

  async getAll() {
    return prisma.user.findMany();
  }

  async getById(id: string) {
    return this.getUserOrFail(id);
  }

  async create(data: CreateUserDTO) {
    await this.ensureUniqueEmail(data.email);
    return prisma.user.create({ data });
  }

  async update(id: string, data: Partial<CreateUserDTO>) {
    await this.getUserOrFail(id);

    if (data.email) {
      await this.ensureUniqueEmail(data.email, id);
    }

    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.getUserOrFail(id);
    return prisma.user.delete({ where: { id } });
  }
}

export const userService = new UserService();
