import { ensureUniqueOrFail, getEntityOrFail } from "@/src/utils/dbHelpers";
import { prisma } from "src/config/prisma";
import { CreateRoleDTO } from "./role.types";

export const roleService = {
  async findAll() {
    return prisma.role.findMany();
  },

  async getById(id: string) {
    return await getEntityOrFail(prisma.role, { id }, "Role não encontrada!");
  },

  async create(data: CreateRoleDTO) {
    await ensureUniqueOrFail(prisma.role, { name: data.name }, "Role já existe!");
    return prisma.role.create({ data });
  },

  async update(id: string, data: Partial<CreateRoleDTO>) {
    await getEntityOrFail(prisma.role, { id }, "Role não encontrada!");
    await ensureUniqueOrFail(prisma.role, { name: data.name }, "Role já existe!", id);

    return prisma.role.update({ where: { id }, data });
  },

  async delete(id: string) {
    await getEntityOrFail(prisma.role, { id }, "Role não encontrada!");
    return prisma.role.delete({ where: { id } });
  },
};
