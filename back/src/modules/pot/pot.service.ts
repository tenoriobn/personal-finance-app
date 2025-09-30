import { prisma } from "@/src/config/prisma";
import AppError from "@/src/utils/appError";
import { CreatePotDTO } from "./pot.type";
import { isValidObjectId } from "@/src/utils/objectId";

class PotService {
  private async getPotOrFail(id: string) {
    if (!isValidObjectId(id)) {
      throw new AppError("ID do tema inválido!", 400);
    }
    
    const pot = await prisma.pot.findUnique({ where: { id } });

    if (!pot) {
      throw new AppError("POT não encontrado!", 404);
    }

    return pot;
  }

  private async ensureUniqueName(name: string, themeId: string, excludeId?: string) {
    if (!isValidObjectId(themeId)) {
      throw new AppError("ID do tema inválido!", 400);
    }

    const theme = await prisma.theme.findUnique({ where: { id: themeId } });

    if (!theme) {
      throw new AppError("Tema não encontrado!", 404);
    }

    const pot = await prisma.pot.findFirst({
      where: {
        OR: [
          { name },
          { themeId }
        ],
        NOT: excludeId ? { id: excludeId } : undefined,
      }
    });

    if (pot) {
      const errorMsg = pot.name === name ? "Nome escolhido já está em uso." : "O tema selecionado já está em uso.";
      throw new AppError(errorMsg, 409);
    }
  }

  async getById(id: string) {
    return this.getPotOrFail(id);
  }

  async getAll() {
    return prisma.pot.findMany();
  }

  async create(data: CreatePotDTO) {
    await this.getPotOrFail(data.userId);
    await this.ensureUniqueName(data.name, data.themeId);

    return prisma.pot.create({ data });
  }

  async update(id: string, data: Partial<CreatePotDTO>) {
    await this.getPotOrFail(id);

    if (data.name && data.themeId) {
      await this.ensureUniqueName(data.name, data.themeId, id);
    }

    return prisma.pot.update({ where: { id }, data });
  }
  
  async delete(id: string) {
    await this.getPotOrFail(id);
    return prisma.pot.delete({ where: { id } });
  }
}

export const potService = new PotService();