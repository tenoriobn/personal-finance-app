/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { categoryService } from "@/modules/category/category.service";
import { prisma } from "@/config/prisma";
import { ensureUniqueOrFail, findEntityOrFail } from "@/core";
import type { CurrentUserDTO } from "@/types/user.type";

vi.mock("@/config/prisma", () => ({
  prisma: {
    category: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/core", () => ({
  ensureUniqueOrFail: vi.fn(),
  findEntityOrFail: vi.fn(),
}));

describe("CategoryService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("Should return all categories", async () => {
      const categories = [
        { id: "1", name: "Alimentação", createdAt: new Date() },
        { id: "2", name: "Transporte", createdAt: new Date() },
      ];

      vi.mocked(prisma.category.findMany).mockResolvedValue(categories);

      const result = await categoryService.getAll();

      expect(prisma.category.findMany).toHaveBeenCalled();
      expect(result).toEqual(categories);
    });
  });

  describe("getUsedCategories", () => {
    it("Should return categories used by the current user", async () => {
      const currentUser: CurrentUserDTO = { id: "user-id", role: "user" };

      const mockCategories = [
        {
          id: "category-id",
          name: "Alimentação",
          budgets: [{ id: "budget-id" }],
        },
      ];

      vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories as any);

      const result = await categoryService.getUsedCategories(currentUser);

      expect(prisma.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            budgets: {
              some: { userId: currentUser.id },
            },
          },
        })
      );

      expect(result).toEqual([
        {
          id: "category-id",
          name: "Alimentação",
          budgetId: "budget-id",
        },
      ]);
    });

    it("Should return null budgetId when category has no budgets", async () => {
      const currentUser: CurrentUserDTO = { id: "user-id", role: "user" };
      
      const mockCategories = [
        {
          id: "category-id",
          name: "Lazer",
          budgets: [],
        },
      ];

      vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories as any);

      const result = await categoryService.getUsedCategories(currentUser);

      expect(result).toEqual([
        {
          id: "category-id",
          name: "Lazer",
          budgetId: null,
        },
      ]);
    });
  });

  describe("getAvailableCategories", () => {
    it("Should return categories not used by the current user", async () => {
      const currentUser: CurrentUserDTO = { id: "user-id", role: "user" };

      const categories = [{ id: "1", name: "Educação", createdAt: new Date() }];

      vi.mocked(prisma.category.findMany).mockResolvedValue(categories);

      const result = await categoryService.getAvailableCategories(currentUser);

      expect(prisma.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            budgets: {
              none: { userId: currentUser.id },
            },
          },
        })
      );

      expect(result).toEqual(categories);
    });
  });

  describe("getById", () => {
    it("Should return category when it exists", async () => {
      const category = { id: "category-id", name: "Saúde" };

      vi.mocked(findEntityOrFail).mockResolvedValue(category);

      const result = await categoryService.getById("category-id");

      expect(findEntityOrFail).toHaveBeenCalledWith(
        prisma.category,
        { id: "category-id" },
        "Categoria não encontrada!"
      );

      expect(result).toEqual(category);
    });
  });

  describe("create", () => {
    it("Should create a category when name is unique", async () => {
      const input = { name: "Nova Categoria" };
      const createdCategory = {
        id: "category-id",
        name: input.name,
        createdAt: new Date(),
      };

      vi.mocked(ensureUniqueOrFail).mockResolvedValue(undefined);
      vi.mocked(prisma.category.create).mockResolvedValue(createdCategory);

      const result = await categoryService.create(input);

      expect(ensureUniqueOrFail).toHaveBeenCalledWith(
        prisma.category,
        { name: input.name },
        "Categoria já está em uso."
      );

      expect(prisma.category.create).toHaveBeenCalledWith({ data: input });
      expect(result).toEqual(createdCategory);
    });
  });

  describe("update", () => {
    it("Should update category without name change", async () => {
      const updatedCategory = {
        id: "category-id",
        name: "Categoria Atualizada",
        createdAt: new Date(),
      };

      vi.mocked(findEntityOrFail).mockResolvedValue(updatedCategory);
      vi.mocked(prisma.category.update).mockResolvedValue(updatedCategory);

      const result = await categoryService.update("category-id", {});

      expect(findEntityOrFail).toHaveBeenCalled();
      expect(ensureUniqueOrFail).not.toHaveBeenCalled();
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: "category-id" },
        data: {},
      });

      expect(result).toEqual(updatedCategory);
    });

    it("Should validate unique name when name is provided", async () => {
      const input = { name: "Categoria Nova" };
      const updatedCategory = {
        id: "category-id",
        name: input.name,
        createdAt: new Date(),
      };

      vi.mocked(findEntityOrFail).mockResolvedValue(updatedCategory);
      vi.mocked(ensureUniqueOrFail).mockResolvedValue(undefined);
      vi.mocked(prisma.category.update).mockResolvedValue(updatedCategory);

      const result = await categoryService.update("category-id", input);

      expect(ensureUniqueOrFail).toHaveBeenCalledWith(
        prisma.category,
        { name: input.name },
        "Categoria já está em uso.",
        "category-id"
      );

      expect(result).toEqual(updatedCategory);
    });
  });

  describe("delete", () => {
    it("Should delete category after validation", async () => {
      vi.mocked(findEntityOrFail).mockResolvedValue({
        id: "category-id",
        name: "Categoria",
        createdAt: new Date(),
      });

      vi.mocked(prisma.category.delete).mockResolvedValue({
        id: "category-id",
        name: "Categoria",
        createdAt: new Date(),
      });

      await categoryService.delete("category-id");

      expect(findEntityOrFail).toHaveBeenCalledWith(
        prisma.category,
        { id: "category-id" },
        "Categoria não encontrada!"
      );

      expect(prisma.category.delete).toHaveBeenCalledWith({
        where: { id: "category-id" },
      });
    });
  });
});
