import { prisma } from "@/src/config/prisma";
import AppError from "@/src/utils/appError";
import { CreateThemeDTO } from "./theme.type";

class ThemeService {
  private async getThemeOrFail(id: string) {
    const theme = await prisma.theme.findUnique({ where: { id } });

    if (!theme) {
      throw new AppError("Tema não encontrado!", 404);
    }

    return theme;
  }

  private async ensureUniqueColor(colorName: string, colorHex: string, excludeId?: string) {
    const theme = await prisma.theme.findFirst({
      where: {
        OR: [
          { colorName },
          { colorHex }
        ],
        NOT: excludeId ? { id: excludeId } : undefined,
      }
    });

    if (theme) {
      const errorMsg = theme.colorName === colorName ? "Nome já existente!" : "Cor já existente!";
      throw new AppError(errorMsg, 409);
    }
  }

  async getAll() {
    return prisma.theme.findMany();
  }

  async getById(id: string) {
    return this.getThemeOrFail(id);
  }

  async create(data: CreateThemeDTO) {
    await this.ensureUniqueColor(data.colorName, data.colorHex);
    return prisma.theme.create({ data });
  }

  async update(id: string, data: Partial<CreateThemeDTO>) {
    await this.getThemeOrFail(id);

    if (data.colorName && data.colorHex) {
      await this.ensureUniqueColor(data.colorName, data.colorHex, id);
    }

    return prisma.theme.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.getThemeOrFail(id);
    return prisma.theme.delete({ where: { id } });
  }
}

export const themeService = new ThemeService();