import { prisma } from "src/config/prisma";
import type { CreateUserDTO } from "./user.types";
import { ensureUniqueOrFail, getEntityOrFail } from "@/src/utils/dbHelpers";

class UserService {
  async getAll() {
    return prisma.user.findMany();
  }

  async getById(id: string) {
    return await getEntityOrFail(prisma.user, { id }, "Usuário não encontrado!");
  }

  async create(data: CreateUserDTO) {
    await ensureUniqueOrFail(prisma.user, { email: data.email }, "E-mail já está em uso!");
    return prisma.user.create({ data });
  }

  async update(id: string, data: Partial<CreateUserDTO>) {
    await getEntityOrFail(prisma.user, { id }, "Usuário não encontrado!");

    if (data.email) {
      await ensureUniqueOrFail(prisma.user, { email: data.email }, "E-mail já está em uso!", id);
    }

    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    await getEntityOrFail(prisma.user, { id }, "Usuário não encontrado!");
    return prisma.user.delete({ where: { id } });
  }
}

export const userService = new UserService();
