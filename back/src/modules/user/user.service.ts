import { prisma } from "src/config/prisma";
import type { CreateUserDTO } from "./user.types";
import { ensureUniqueOrFail, getEntityOrFail } from "@/src/utils/dbHelpers";
import bcrypt from "bcryptjs";
import { resolveAccessFilter } from "@/src/utils/accessControl";
import { CurrentUserDTO } from "@/src/types/user.type";

class UserService {
  async getAll(currentUser: CurrentUserDTO) {
    const where = resolveAccessFilter({ currentUser });
    const users = await prisma.user.findMany({ where });

    return users.map(user => ({ ...user, password: undefined }));
  }

  async getById(id: string, currentUser: CurrentUserDTO) {
    resolveAccessFilter({ currentUser, resourceOwnerId: id });

    const user = await getEntityOrFail(prisma.user, { id }, "Usuário não encontrado!");
    return { ...user, password: undefined };
  }

  async update(id: string, data: Partial<CreateUserDTO>, currentUser: CurrentUserDTO) {
    resolveAccessFilter({ currentUser, resourceOwnerId: id });

    await getEntityOrFail(prisma.user, { id }, "Usuário não encontrado!");

    if (data.email) {
      await ensureUniqueOrFail(prisma.user, { email: data.email }, "E-mail já está em uso!", id);
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.user.update({ where: { id }, data });

    return { ...user, password: undefined };
  }

  async delete(id: string, currentUser: CurrentUserDTO) {
    resolveAccessFilter({ currentUser, resourceOwnerId: id });
    
    await getEntityOrFail(prisma.user, { id }, "Usuário não encontrado!");

    return prisma.user.delete({ where: { id } });
  }

  async updateRole(userId: string, roleId: string, currentUser: CurrentUserDTO) {
    resolveAccessFilter({ currentUser, resourceOwnerId: userId });

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
