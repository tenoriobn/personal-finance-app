import { prisma } from "@/src/config/prisma";
import { CreateThemeDTO } from "./theme.type";
import { ensureUniqueOrFail, findEntityOrFail } from "@/src/core";

class ThemeService {
  async getAll() {
    return prisma.theme.findMany();
  }

  async getById(id: string) {
    return await findEntityOrFail(
      prisma.theme,
      { id },
      "Tema não encontrado!"
    );
  }

  async create(data: CreateThemeDTO) {
    if (data.colorName) {
      await ensureUniqueOrFail(prisma.theme, { colorName: data.colorName }, "O nome do tema já está em uso.");
    }

    if (data.colorHex) {
      await ensureUniqueOrFail(prisma.theme, { colorHex: data.colorHex }, "A cor do tema já está em uso.");
    }

    return prisma.theme.create({ data });
  }

  async update(id: string, data: Partial<CreateThemeDTO>) {
    await findEntityOrFail(prisma.theme, { id }, "Tema não encontrado!");

    if (data.colorName) {
      await ensureUniqueOrFail(prisma.theme, { colorName: data.colorName }, "O nome do tema já está em uso.", id);
    }

    if (data.colorHex) {
      await ensureUniqueOrFail(prisma.theme, { colorHex: data.colorHex }, "A cor do tema já está em uso.", id);
    }

    return prisma.theme.update({ where: { id }, data });
  }

  async delete(id: string) {
    await findEntityOrFail(prisma.theme, { id }, "Tema não encontrado!");
    
    return prisma.theme.delete({ where: { id } });
  }
}

export const themeService = new ThemeService();