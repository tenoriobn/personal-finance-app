import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Context } from "hono";
import { categoryController } from "src/modules/category/category.controller";
import { categoryService } from "src/modules/category/category.service";

vi.mock("src/modules/category/category.service", () => ({
  categoryService: {
    getAll: vi.fn(),
    getUsedCategories: vi.fn(),
    getAvailableCategories: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

interface MockContextOptions {
  params?: Record<string, string>;
  body?: unknown;
  user?: unknown;
}

const createMockContext = (
  options: MockContextOptions = {}
): Context =>
  ({
    req: {
      param: vi.fn((key: string) => options.params?.[key]),
      json: vi.fn(async () => options.body),
    },
    get: vi.fn((key: string) => {
      if (key === "user") {return options.user;}
      return undefined;
    }),
    json: vi.fn(),
  }) as unknown as Context;

describe("CategoryController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("Should return all categories with status 200", async () => {
      const categories = [{ id: "1", name: "Alimentação", createdAt: new Date() }];

      vi.mocked(categoryService.getAll).mockResolvedValue(categories);

      const ctx = createMockContext();

      await categoryController.getAll(ctx);

      expect(categoryService.getAll).toHaveBeenCalledTimes(1);
      expect(ctx.json).toHaveBeenCalledWith(categories, 200);
    });
  });

  describe("getUsedCategories", () => {
    it("Should return used categories for current user", async () => {
      const user = { id: "user-id" };
      const categories = [{ id: "1", name: "Transporte", createdAt: new Date(), budgetId: "budget-id" }];

      vi.mocked(categoryService.getUsedCategories).mockResolvedValue(categories);

      const ctx = createMockContext({ user });

      await categoryController.getUsedCategories(ctx);

      expect(categoryService.getUsedCategories).toHaveBeenCalledWith(user);
      expect(ctx.json).toHaveBeenCalledWith(categories, 200);
    });
  });

  describe("getAvailableCategories", () => {
    it("Should return available categories for current user", async () => {
      const user = { id: "user-id" };
      const categories = [{ id: "2", name: "Lazer" }];

      vi.mocked(
        categoryService.getAvailableCategories
      ).mockResolvedValue(categories);

      const ctx = createMockContext({ user });

      await categoryController.getAvailableCategories(ctx);

      expect(categoryService.getAvailableCategories).toHaveBeenCalledWith(user);
      expect(ctx.json).toHaveBeenCalledWith(categories, 200);
    });
  });

  describe("getById", () => {
    it("Should return category by id", async () => {
      const category = { id: "category-id", name: "Moradia", createdAt: new Date() };

      vi.mocked(categoryService.getById).mockResolvedValue(category);

      const ctx = createMockContext({
        params: { id: "category-id" },
      });

      await categoryController.getById(ctx);

      expect(categoryService.getById).toHaveBeenCalledWith("category-id");
      expect(ctx.json).toHaveBeenCalledWith(category, 200);
    });
  });

  describe("create", () => {
    it("Should return 400 when validation fails", async () => {
      const ctx = createMockContext({
        body: { name: "" },
      });

      await categoryController.create(ctx);

      expect(categoryService.create).not.toHaveBeenCalled();
      expect(ctx.json).toHaveBeenCalledWith(
        { error: expect.any(Object) },
        400
      );
    });

    it("Should create category and return 201", async () => {
      const input = { name: "Nova Categoria", };
      const category = { id: "category-id", createdAt: new Date(), ...input };

      vi.mocked(categoryService.create).mockResolvedValue(category);

      const ctx = createMockContext({
        body: input,
      });

      await categoryController.create(ctx);

      expect(categoryService.create).toHaveBeenCalledWith(input);
      expect(ctx.json).toHaveBeenCalledWith(category, 201);
    });
  });

  describe("update", () => {
    it("Should return 400 when validation fails", async () => {
      const ctx = createMockContext({
        params: { id: "category-id" },
        body: { name: "" },
      });

      await categoryController.update(ctx);

      expect(categoryService.update).not.toHaveBeenCalled();
      expect(ctx.json).toHaveBeenCalledWith(
        { error: expect.any(Object) },
        400
      );
    });

    it("Should update category and return 200", async () => {
      const input = { name: "Categoria Atualizada" };
      const category = {
        id: "category-id",
        name: input.name,
        createdAt: new Date(),
      };

      vi.mocked(categoryService.update).mockResolvedValue(category);

      const ctx = createMockContext({
        params: { id: "category-id" },
        body: input,
      });

      await categoryController.update(ctx);

      expect(categoryService.update).toHaveBeenCalledWith("category-id", input);
      expect(ctx.json).toHaveBeenCalledWith(category, 200);
    });
  });

  describe("delete", () => {
    it("Should delete category and return 200", async () => {
      vi.mocked(categoryService.delete).mockResolvedValue({
        id: "category-id",
        name: "Categoria Teste",
        createdAt: new Date(),
      });


      const ctx = createMockContext({
        params: { id: "category-id" },
      });

      await categoryController.delete(ctx);

      expect(categoryService.delete).toHaveBeenCalledWith("category-id");
      expect(ctx.json).toHaveBeenCalledWith(
        { message: "Categoria removida com sucesso!" },
        200
      );
    });
  });
});
