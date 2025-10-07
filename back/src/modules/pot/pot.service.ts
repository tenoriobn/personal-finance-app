import { prisma } from "@/src/config/prisma";
import { CreatePotDTO } from "./pot.type";
import { potSelect } from "./pot.select";
import { ensureUniqueOrFail, getEntityOrFail } from "@/src/utils/dbHelpers";

class PotService {
  async getAll() {
    return prisma.pot.findMany({
      select: potSelect
    });
  }

  async getById(id: string) {
    return await getEntityOrFail(prisma.pot, { id }, "POT não encontrado!", { select: potSelect });
  }

  async create(data: CreatePotDTO) {
    await getEntityOrFail(prisma.user, { id: data.userId }, "Usuário não encontrado!");

    if (data.themeId) {
      await getEntityOrFail(prisma.theme, { id: data.themeId }, "Tema não encontrado!");
    }

    if (data.name) {
      await ensureUniqueOrFail(prisma.pot, { name: data.name }, "Nome já está em uso.");
    }

    if (data.themeId) {
      await ensureUniqueOrFail(prisma.pot, { themeId: data.themeId }, "O tema selecionado já está em uso.");
    }

    return prisma.pot.create({ data });
  }

  async update(id: string, data: Partial<CreatePotDTO>) {
    await getEntityOrFail(prisma.pot, { id }, "Usuário não encontrado!");

    if (data.themeId) {
      await getEntityOrFail(prisma.theme, { id: data.themeId }, "Tema não encontrado!");
    }

    if (data.name) {
      await ensureUniqueOrFail(prisma.pot, { name: data.name }, "Nome já está em uso.", id);
    }

    if (data.themeId) {
      await ensureUniqueOrFail(prisma.pot, { themeId: data.themeId }, "O tema selecionado já está em uso.", id);
    }


    return prisma.pot.update({ where: { id }, data });
  }
  
  async delete(id: string) {
    await getEntityOrFail(prisma.pot, { id }, "POT não encontrado!");
    return prisma.pot.delete({ where: { id } });
  }
}

export const potService = new PotService();