import { prisma } from "src/config/prisma";
import type { CreateUserDTO } from "./user.types";
import { ensureUniqueOrFail, getEntityOrFail } from "@/src/utils/dbHelpers";
import bcrypt from "bcryptjs";

class UserService {
  async getAll(userId: string) {
    const users = await prisma.user.findMany({ where: { id: userId } });
    return users.map(user => ({ ...user, password: undefined }));
  }

  async getById(id: string) {
    const user = await getEntityOrFail(prisma.user, { id }, "Usuário não encontrado!");
    return { ...user, password: undefined };
  }

  async create(data: CreateUserDTO) {
    await ensureUniqueOrFail(prisma.user, { email: data.email }, "E-mail já está em uso!");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userRole = await prisma.role.findUnique({ where: { name: "USER" } });

    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword, roleId: userRole!.id },
      include: { role: true },
    });

    return { ...user, password: undefined };
  }

  async update(id: string, data: Partial<CreateUserDTO>, userId: string) {
    await getEntityOrFail(prisma.user, { id, userId }, "Usuário não encontrado!");

    if (data.email) {
      await ensureUniqueOrFail(prisma.user, { email: data.email }, "E-mail já está em uso!", id);
    }

    const updatedData = { ...data };

    if (data.password) {
      updatedData.password = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.user.update({ where: { id }, data: updatedData });

    return { ...user, password: undefined };
  }

  async delete(id: string, userId: string) {
    await getEntityOrFail(prisma.user, { id, userId }, "Usuário não encontrado!");
    return prisma.user.delete({ where: { id } });
  }

  async updateRole(userId: string, roleId: string) {
    await getEntityOrFail(prisma.user, { id: userId }, "Usuário não encontrado!");
    await getEntityOrFail(prisma.role, { id: roleId }, "Role não encontrada!");

    return prisma.user.update({
      where: { id: userId },
      data: { roleId },
      include: { role: true },
    });
  }
}

export const userService = new UserService();
