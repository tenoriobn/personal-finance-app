import { ensureUniqueOrFail, findEntityOrFail } from "@/src/core";
import { prisma } from "src/config/prisma";
import { CreateRoleDTO } from "./role.types";

export const roleService = {
  async findAll() {
    return prisma.role.findMany();
  },

  async getById(id: string) {
    return await findEntityOrFail(prisma.role, { id }, "Role não encontrada!");
  },

  async create(data: CreateRoleDTO) {
    await ensureUniqueOrFail(prisma.role, { name: data.name }, "Role já existe!");
    return prisma.role.create({ data });
  },

  async update(id: string, data: Partial<CreateRoleDTO>) {
    await findEntityOrFail(prisma.role, { id }, "Role não encontrada!");
    await ensureUniqueOrFail(prisma.role, { name: data.name }, "Role já existe!", id);

    return prisma.role.update({ where: { id }, data });
  },

  async delete(id: string) {
    await findEntityOrFail(prisma.role, { id }, "Role não encontrada!");
    return prisma.role.delete({ where: { id } });
  },
};
