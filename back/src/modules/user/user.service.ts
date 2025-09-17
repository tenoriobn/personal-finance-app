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

  async getAll() {
    return prisma.user.findMany();
  }

  async getById(id: string) {
    return this.getUserOrFail(id);
  }

  async create(data: CreateUserDTO) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new AppError("Usuário já cadastrado!", 409);
    }

    return prisma.user.create({ data });
  }

  async update(id: string, data: Partial<CreateUserDTO>) {
    await this.getUserOrFail(id);
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.getUserOrFail(id);
    return prisma.user.delete({ where: { id } });
  }
}

export const userService = new UserService();
