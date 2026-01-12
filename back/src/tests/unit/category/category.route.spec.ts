import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";

vi.mock("src/middleware/authorize", () => ({
  authorize: () => async (ctx: unknown, next: () => Promise<void>) => {
    await next();
  },
}));

vi.mock("src/middleware/validateId", () => ({
  validateId: async (ctx: unknown, next: () => Promise<void>) => {
    await next();
  },
}));

vi.mock("src/modules/category/category.controller", () => ({
  categoryController: {
    getAll: vi.fn(),
    getUsedCategories: vi.fn(),
    getAvailableCategories: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { categoryRoutes } from "src/modules/category/category.route";
import { categoryController } from "src/modules/category/category.controller";

describe("CategoryRoutes", () => {
  let app: Hono;

  beforeEach(() => {
    vi.clearAllMocks();
    app = new Hono();
    app.route("/categories", categoryRoutes);
  });

  it("Should call categoryController.getAll when GET /categories is requested", async () => {
    vi.mocked(categoryController.getAll).mockImplementation(async (ctx) => {
      return ctx.json([], 200);
    });

    const response = await app.request("/categories");

    expect(categoryController.getAll).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
  });

  it("Should call categoryController.getUsedCategories when GET /categories/used is requested", async () => {
    vi.mocked(categoryController.getUsedCategories).mockImplementation(async (ctx) => {
      return ctx.json([], 200);
    });

    const response = await app.request("/categories/used");

    expect(categoryController.getUsedCategories).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
  });

  it("Should call categoryController.getAvailableCategories when GET /categories/available is requested", async () => {
    vi.mocked(categoryController.getAvailableCategories).mockImplementation(async (ctx) => {
      return ctx.json([], 200);
    });

    const response = await app.request("/categories/available");

    expect(categoryController.getAvailableCategories).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
  });

  it("Should call categoryController.getById when GET /categories/:id is requested", async () => {
    vi.mocked(categoryController.getById).mockImplementation(async (ctx) => {
      return ctx.json(
        {
          id: "category-id",
          name: "Alimentação",
          createdAt: new Date(),
        },
        200
      );
    });

    const response = await app.request("/categories/category-id");

    expect(categoryController.getById).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
  });

  it("Should call categoryController.create when POST /categories is requested", async () => {
    vi.mocked(categoryController.create).mockImplementation(async (ctx) => {
      return ctx.json(
        {
          id: "category-id",
          name: "Nova Categoria",
          createdAt: new Date(),
        },
        201
      );
    });

    const response = await app.request("/categories", {
      method: "POST",
      body: JSON.stringify({ name: "Nova Categoria" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(categoryController.create).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(201);
  });

  it("Should call categoryController.update when PUT /categories/:id is requested", async () => {
    vi.mocked(categoryController.update).mockImplementation(async (ctx) => {
      return ctx.json(
        {
          id: "category-id",
          name: "Categoria Atualizada",
          createdAt: new Date(),
        },
        200
      );
    });

    const response = await app.request("/categories/category-id", {
      method: "PUT",
      body: JSON.stringify({ name: "Categoria Atualizada" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(categoryController.update).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
  });

  it("Should call categoryController.delete when DELETE /categories/:id is requested", async () => {
    vi.mocked(categoryController.delete).mockImplementation(async (ctx) => {
      return ctx.json(
        { message: "Categoria removida com sucesso" },
        200
      );
    });

    const response = await app.request("/categories/category-id", {
      method: "DELETE",
    });

    expect(categoryController.delete).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
  });
});
