import { prisma } from "src/config/prisma";
import { CreatePotDTO } from "./pot.type";
import { potSelect } from "./pot.select";
import { ensureUniqueOrFail, findOrFail } from "src/core";
import { CurrentUserDTO } from "src/types/user.type";
import { normalizeString } from "@/utils/format/normalizeString";

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
    const normalized = normalizeString(data.name);

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
        { normalizedName: normalized, userId: currentUser.id },
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

    const payload = { ...data, userId: currentUser.id, normalizedName: normalizeString(data.name), };

    return prisma.pot.create({ data: payload });
  }

  async update(id: string, data: Partial<CreatePotDTO>, currentUser: CurrentUserDTO) {
    const normalized = data.name ? normalizeString(data.name) : undefined;
    
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
        { normalizedName: normalized, userId: currentUser.id },
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

    const payload = { 
      ...data, userId: currentUser.id, 
      normalizedName: normalized 
    };
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