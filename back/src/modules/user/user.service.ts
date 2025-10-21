import { prisma } from "src/config/prisma";
import type { CreateUserDTO } from "./user.types";
import { ensureUniqueOrFail, findOrFail, } from "@/src/core";
import bcrypt from "bcryptjs";
import { CurrentUserDTO } from "@/src/types/user.type";
import { userSelect } from "./user.select";

class UserService {
  async getAll(currentUser: CurrentUserDTO) {
    const where = currentUser.role === "ADMIN" ? {} : { id: currentUser.id };
    const users = await prisma.user.findMany({ where });

    return users.map(user => ({ ...user, password: undefined }));
  }

  async getById(id: string, currentUser: CurrentUserDTO) {
    return findOrFail(
      prisma.user, 
      { id }, 
      currentUser, 
      { select: userSelect, checkOwnership: true, notFoundMessage: "Usuário não encontrado!" }
    );
  }

  async update(id: string, data: Partial<CreateUserDTO>, currentUser: CurrentUserDTO) {
    await findOrFail(
      prisma.user,
      { id },
      currentUser,
      { checkOwnership: true, notFoundMessage: "Usuário não encontrado!" }
    );

    if (data.email) { await ensureUniqueOrFail(prisma.user, { email: data.email }, "E-mail já está em uso!", id); }
    
    if (data.password) { data.password = await bcrypt.hash(data.password, 10); }

    const user = await prisma.user.update({ where: { id }, select: userSelect, data });
    return user;
  }

  async delete(id: string, currentUser: CurrentUserDTO) {
    await findOrFail(
      prisma.user,
      { id },
      currentUser,
      { checkOwnership: true, notFoundMessage: "Usuário não encontrado!" }
    );

    return prisma.user.delete({ where: { id } });
  }

  async updateRole(userId: string, roleId: string, currentUser: CurrentUserDTO) {
    await findOrFail(
      prisma.user,
      { id: userId },
      currentUser,
      { checkOwnership: true, notFoundMessage: "Usuário não encontrado!" }
    );

    await findOrFail(
      prisma.role,
      { id: roleId },
      currentUser,
      { checkOwnership: true, notFoundMessage: "Role não encontrada!" }
    );

    return prisma.user.update({
      where: { id: userId },
      data: { roleId },
      include: { role: true },
    });
  }
}

export const userService = new UserService();
