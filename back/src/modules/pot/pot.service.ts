import { prisma } from "@/src/config/prisma";
import { CreatePotDTO } from "./pot.type";
import { potSelect } from "./pot.select";
import { ensureUniqueOrFail, getEntityOrFail } from "@/src/utils/dbHelpers";

class PotService {
  async getAll(userId: string) {
    return prisma.pot.findMany({
      where: { userId },
      select: potSelect
    });
  }

  async getById(id: string, userId: string) {
    return await getEntityOrFail(prisma.pot, { id, userId }, "POT não encontrado!", { select: potSelect });
  }

  async create(data: CreatePotDTO, userId: string) {
    await getEntityOrFail(prisma.user, { id: userId }, "Usuário não encontrado!");

    if (data.themeId) {
      await getEntityOrFail(prisma.theme, { id: data.themeId }, "Tema não encontrado!");
    }

    if (data.name) {
      await ensureUniqueOrFail(prisma.pot, { name: data.name, userId }, "Nome já está em uso.");
    }

    if (data.themeId) {
      await ensureUniqueOrFail(prisma.pot, { themeId: data.themeId, userId }, "O tema selecionado já está em uso.");
    }

    return prisma.pot.create({ data });
  }

  async update(id: string, data: Partial<CreatePotDTO>, userId: string) {
    await getEntityOrFail(prisma.pot, { id, userId }, "Usuário não encontrado!");

    if (data.themeId) {
      await getEntityOrFail(prisma.theme, { id: data.themeId }, "Tema não encontrado!");
    }

    if (data.name) {
      await ensureUniqueOrFail(prisma.pot, { name: data.name, userId }, "Nome já está em uso.", id);
    }

    if (data.themeId) {
      await ensureUniqueOrFail(prisma.pot, { themeId: data.themeId, userId }, "O tema selecionado já está em uso.", id);
    }


    return prisma.pot.update({ where: { id }, data });
  }
  
  async delete(id: string, userId: string) {
    await getEntityOrFail(prisma.pot, { id, userId }, "POT não encontrado!");
    return prisma.pot.delete({ where: { id } });
  }
}

export const potService = new PotService();