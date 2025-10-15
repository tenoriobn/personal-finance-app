import { prisma } from "@/src/config/prisma";
import { CreatePotDTO } from "./pot.type";
import { potSelect } from "./pot.select";
import { ensureUniqueOrFail, findOrFail } from "@/src/utils/dbHelpers";
import { CurrentUserDTO } from "@/src/types/user.type";

class PotService {
  async getAll(currentUser: CurrentUserDTO) {
    const where = currentUser.role === "ADMIN" ? {} : { userId: currentUser.id };

    return prisma.pot.findMany({
      where,
      select: potSelect
    });
  }

  async getById(id: string, currentUser: CurrentUserDTO) {
    return findOrFail(
      prisma.pot, 
      { id }, 
      currentUser, 
      { select: potSelect, checkOwnership: true, notFoundMessage: "Usuário não encontrado!" }
    );
  }

  async create(data: CreatePotDTO, currentUser: CurrentUserDTO) {
    await findOrFail(
      prisma.user,
      { id: currentUser.id },
      currentUser,
      { notFoundMessage: "Usuário não encontrado!" }
    ); 

    if (data.themeId) {
      await findOrFail(
        prisma.theme,
        { id: data.themeId },
        currentUser,
        { notFoundMessage: "Tema não encontrado!" }
      );
    }

    if (data.name) {
      await ensureUniqueOrFail(
        prisma.pot,
        { name: data.name, userId: currentUser.id },
        "Este nome já está em uso."
      );
    }

    if (data.themeId) {
      await ensureUniqueOrFail(
        prisma.pot,
        { themeId: data.themeId, userId: currentUser.id },
        "O tema selecionado já está em uso."
      );
    }

    const payload = { ...data, userId: currentUser.id };

    return prisma.pot.create({ data: payload });
  }

  async update(id: string, data: Partial<CreatePotDTO>, currentUser: CurrentUserDTO) {
    await findOrFail(
      prisma.user,
      { id: currentUser.id },
      currentUser,
      { notFoundMessage: "Usuário não encontrado!" }
    ); 

    await findOrFail(
      prisma.pot,
      { id },
      currentUser,
      { checkOwnership: true, notFoundMessage: "Pot não encontrado!" }
    ); 

    if (data.themeId) {
      await findOrFail(
        prisma.theme,
        { id: data.themeId },
        currentUser,
        { notFoundMessage: "Tema não encontrado!" }
      );  
    }

    if (data.name) {
      await ensureUniqueOrFail(
        prisma.pot, 
        { name: data.name, userId: currentUser.id }, 
        "Nome já está em uso.", 
        id
      );
    }

    if (data.themeId) {
      await ensureUniqueOrFail(
        prisma.pot, 
        { themeId: data.themeId, userId: currentUser.id }, 
        "O tema selecionado já está em uso.", 
        id
      );
    }

    const payload = { ...data, userId: currentUser.id };

    return prisma.pot.update({ where: { id }, data: payload });
  }
  
  async delete(id: string, currentUser: CurrentUserDTO) {
    await findOrFail(
      prisma.pot,
      { id },
      currentUser,
      { checkOwnership: true, notFoundMessage: "Pot não encontrado!" }
    ); 

    return prisma.pot.delete({ where: { id } });
  }
}

export const potService = new PotService();