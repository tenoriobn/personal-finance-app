import { prisma } from "@/src/config/prisma";
import { CreatePotDTO } from "./pot.type";
import { potSelect } from "./pot.select";
import { ensureUniqueOrFail, getEntityOrFail } from "@/src/utils/dbHelpers";
import { CurrentUserDTO } from "@/src/types/user.type";
import { resolveAccessFilter } from "@/src/utils/accessControl";

class PotService {
  async getAll(currentUser: CurrentUserDTO) {
    const where = resolveAccessFilter({ currentUser });

    return prisma.pot.findMany({
      where,
      select: potSelect
    });
  }

  async getById(id: string, currentUser: CurrentUserDTO) {
    const where = resolveAccessFilter({ currentUser, resourceOwnerId: id });
    return await getEntityOrFail(prisma.pot, { id, userId: where }, "POT não encontrado!", { select: potSelect });
  }

  async create(data: CreatePotDTO, currentUser: CurrentUserDTO) {
    resolveAccessFilter({ currentUser, resourceOwnerId: data.userId });

    await getEntityOrFail(prisma.user, { id: currentUser.id }, "Usuário não encontrado!");

    if (data.themeId) {
      await getEntityOrFail(prisma.theme, { id: data.themeId }, "Tema não encontrado!");
    }

    if (data.name) {
      await ensureUniqueOrFail(prisma.pot, { name: data.name, userId: data.userId }, "Nome já está em uso.");
    }

    if (data.themeId) {
      await ensureUniqueOrFail(prisma.pot, { themeId: data.themeId, userId: data.userId }, "O tema selecionado já está em uso.");
    }

    return prisma.pot.create({ data });
  }

  async update(id: string, data: Partial<CreatePotDTO>, currentUser: CurrentUserDTO) {
    resolveAccessFilter({ currentUser, resourceOwnerId: data.userId });

    await getEntityOrFail(prisma.user, { id: currentUser.id }, "Usuário não encontrado!");

    if (data.themeId) {
      await getEntityOrFail(prisma.theme, { id: data.themeId }, "Tema não encontrado!");
    }

    if (data.name) {
      await ensureUniqueOrFail(prisma.pot, { name: data.name, userId: currentUser.id }, "Nome já está em uso.", id);
    }

    if (data.themeId) {
      await ensureUniqueOrFail(prisma.pot, { themeId: data.themeId, userId: currentUser.id }, "O tema selecionado já está em uso.", id);
    }

    return prisma.pot.update({ where: { id }, data });
  }
  
  async delete(id: string, currentUser: CurrentUserDTO) {
    resolveAccessFilter({ currentUser, resourceOwnerId: id });

    await getEntityOrFail(prisma.pot, { id }, "POT não encontrado!");

    return prisma.pot.delete({ where: { id } });
  }
}

export const potService = new PotService();