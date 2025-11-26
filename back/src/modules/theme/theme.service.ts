import { prisma } from "src/config/prisma";
import { CreateThemeDTO } from "./theme.type";
import { ensureUniqueOrFail, findEntityOrFail } from "src/core";
import { CurrentUserDTO } from "@/types/user.type";

class ThemeService {
  private async getUsedThemesByRelation(
    relation: "budgets" | "pots",
    userId: string
  ) {
    const themes = await prisma.theme.findMany({
      where: {
        [relation]: {
          some: { userId },
        },
      },
      select: {
        id: true,
        colorHex: true,
        colorName: true,
        [relation]: {
          where: { userId },
          select: { id: true },
          take: 1,
        },
      },
    });

    return themes.map(theme => ({
      id: theme.id,
      colorName: theme.colorName,
      colorHex: theme.colorHex,
      relationId: theme[relation]?.[0]?.id ?? null,
    }));
  }

  private async getAvailableThemesByRelation(
    relation: "budgets" | "pots",
    userId: string
  ) {
    return prisma.theme.findMany({
      where: {
        [relation]: {
          none: { userId },
        },
      },
      select: { id: true, colorName: true },
    });
  }

  async getAll() {
    return prisma.theme.findMany();
  }

  getThemesUsedInBudgets(user: CurrentUserDTO) {
    return this.getUsedThemesByRelation("budgets", user.id);
  }

  getThemesAvailableForBudgets(user: CurrentUserDTO) {
    return this.getAvailableThemesByRelation("budgets", user.id);
  }

  getThemesUsedInPots(user: CurrentUserDTO) {
    return this.getUsedThemesByRelation("pots", user.id);
  }

  getThemesAvailableForPots(user: CurrentUserDTO) {
    return this.getAvailableThemesByRelation("pots", user.id);
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