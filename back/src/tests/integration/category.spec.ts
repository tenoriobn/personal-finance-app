/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";
import type { CurrentUserDTO } from "src/types/user.type";

vi.mock("src/config/prisma", () => ({
  prisma: {
    category: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("src/core", () => ({
  ensureUniqueOrFail: vi.fn(),
  findEntityOrFail: vi.fn(),
}));

import { prisma } from "src/config/prisma";
import { categoryRoutes } from "src/modules/category/category.route";
import { ensureUniqueOrFail, findEntityOrFail } from "src/core";

type AppVariables = {
  Variables: {
    user: CurrentUserDTO;
  };
};

describe("Category Integration (route → controller → service)", () => {
  let app: Hono<AppVariables>;

  beforeEach(() => {
    vi.clearAllMocks();

    app = new Hono<AppVariables>();
    
    app.use("/categories/*", async (c, next) => {
      const user: CurrentUserDTO = {
        id: "user-id",
        role: "ADMIN",
      };
      c.set("user", user);
      await next();
    });

    app.route("/categories", categoryRoutes);
  });

  describe("GET /categories", () => {
    it("Should return all categories", async () => {
      const mockCategories = [
        { id: "1", name: "Alimentação", createdAt: new Date() },
        { id: "2", name: "Transporte", createdAt: new Date() },
      ];

      vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories);

      const response = await app.request("/categories");
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual([
        expect.objectContaining({ id: "1", name: "Alimentação" }),
        expect.objectContaining({ id: "2", name: "Transporte" }),
      ]);
      expect(prisma.category.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /categories/used", () => {
    it("Should return categories used by current user", async () => {
      const mockCategories = [
        {
          id: "1",
          name: "Alimentação",
          budgets: [{ id: "budget-1" }],
        },
      ];

      vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories as any);

      const response = await app.request("/categories/used");
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual([
        {
          id: "1",
          name: "Alimentação",
          budgetId: "budget-1",
        },
      ]);
      expect(prisma.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            budgets: {
              some: { userId: "user-id" },
            },
          },
        })
      );
    });
  });

  describe("GET /categories/available", () => {
    it("Should return categories not used by current user", async () => {
      const mockCategories = [
        { id: "1", name: "Educação" },
        { id: "2", name: "Lazer" },
      ];

      vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories as any);

      const response = await app.request("/categories/available");
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(mockCategories);
      expect(prisma.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            budgets: {
              none: { userId: "user-id" },
            },
          },
        })
      );
    });
  });

  describe("GET /categories/:id", () => {
    it("Should return category by id", async () => {
      const mockCategory = {
        id: "507f1f77bcf86cd799439011",
        name: "Saúde",
        createdAt: new Date(),
      };

      vi.mocked(findEntityOrFail).mockResolvedValue(mockCategory);

      const response = await app.request("/categories/507f1f77bcf86cd799439011");
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(
        expect.objectContaining({ 
          id: "507f1f77bcf86cd799439011", 
          name: "Saúde" 
        })
      );
      expect(findEntityOrFail).toHaveBeenCalledWith(
        prisma.category,
        { id: "507f1f77bcf86cd799439011" },
        "Categoria não encontrada!"
      );
    });
  });

  describe("POST /categories", () => {
    it("Should create a new category", async () => {
      const input = { name: "Nova Categoria" };
      const mockCreated = {
        id: "new-id",
        name: "Nova Categoria",
        createdAt: new Date(),
      };

      vi.mocked(ensureUniqueOrFail).mockResolvedValue(undefined);
      vi.mocked(prisma.category.create).mockResolvedValue(mockCreated);

      const response = await app.request("/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body).toEqual(
        expect.objectContaining({ 
          id: "new-id", 
          name: "Nova Categoria" 
        })
      );
      expect(ensureUniqueOrFail).toHaveBeenCalledWith(
        prisma.category,
        { name: input.name },
        "Categoria já está em uso."
      );
      expect(prisma.category.create).toHaveBeenCalledWith({ data: input });
    });

    it("Should return 400 when validation fails", async () => {
      const response = await app.request("/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "AB" }), // Nome muito curto
      });

      expect(response.status).toBe(400);
    });
  });

  describe("PUT /categories/:id", () => {
    it("Should update category", async () => {
      const input = { name: "Categoria Atualizada" };
      const mockUpdated = {
        id: "507f1f77bcf86cd799439011",
        name: "Categoria Atualizada",
        createdAt: new Date(),
      };

      vi.mocked(findEntityOrFail).mockResolvedValue(mockUpdated);
      vi.mocked(ensureUniqueOrFail).mockResolvedValue(undefined);
      vi.mocked(prisma.category.update).mockResolvedValue(mockUpdated);

      const response = await app.request("/categories/507f1f77bcf86cd799439011", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(
        expect.objectContaining({ 
          id: "507f1f77bcf86cd799439011", 
          name: "Categoria Atualizada" 
        })
      );
      expect(findEntityOrFail).toHaveBeenCalled();
      expect(ensureUniqueOrFail).toHaveBeenCalledWith(
        prisma.category,
        { name: input.name },
        "Categoria já está em uso.",
        "507f1f77bcf86cd799439011"
      );
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: "507f1f77bcf86cd799439011" },
        data: input,
      });
    });
  });

  describe("DELETE /categories/:id", () => {
    it("Should delete category", async () => {
      const mockCategory = {
        id: "507f1f77bcf86cd799439011",
        name: "Categoria",
        createdAt: new Date(),
      };

      vi.mocked(findEntityOrFail).mockResolvedValue(mockCategory);
      vi.mocked(prisma.category.delete).mockResolvedValue(mockCategory);

      const response = await app.request("/categories/507f1f77bcf86cd799439011", {
        method: "DELETE",
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({ message: "Categoria removida com sucesso!" });
      expect(findEntityOrFail).toHaveBeenCalledWith(
        prisma.category,
        { id: "507f1f77bcf86cd799439011" },
        "Categoria não encontrada!"
      );
      expect(prisma.category.delete).toHaveBeenCalledWith({
        where: { id: "507f1f77bcf86cd799439011" },
      });
    });
  });
});