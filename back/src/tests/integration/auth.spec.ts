import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "src/modules/auth/auth.service";
import { AppError } from "src/utils";

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

vi.mock("src/utils", async () => {
  const actual = await vi.importActual<typeof import("src/utils")>("src/utils");
  return {
    ...actual,
    signToken: vi.fn(() => "jwt-token"),
  };
});

vi.mock("src/config/prisma", () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    role: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "src/config/prisma";
import bcrypt from "bcryptjs";

describe("Auth Integration (direct service)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(bcrypt.hash).mockResolvedValue("$2a$10$hashedpassword" as never);
    vi.mocked(bcrypt.compare).mockImplementation(
      async (pwd: string) => pwd === "123456"
    );
  });

  it("should create a user and return token", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
    
    vi.mocked(prisma.role.findUnique).mockResolvedValue({
      id: "693991789c031cc034ff0c0b",
      name: "USER",
      createdAt: new Date(),
    });
    
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "693991789c031cc034ff0c0a",
      email: "test@example.com",
      password: "$2a$10$hashedpassword",
      roleId: "693991789c031cc034ff0c0b",
      createdAt: new Date(),
      role: { 
        id: "693991789c031cc034ff0c0b", 
        name: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const result = await authService.create({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });

    expect(result.token).toBe("jwt-token");
    expect(result.user.email).toBe("test@example.com");
    expect(result.user.role).toBe("USER");
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it("should throw 400 if trying to create duplicate user", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue({
      id: "693991789c031cc034ff0c0a",
      name: "Test User",
      email: "test@example.com",
      password: "hashed",
      roleId: "693991789c031cc034ff0c0b",
      createdAt: new Date(),
    });

    await expect(
      authService.create({
        name: "Test User",
        email: "test@example.com",
        password: "123456",
      })
    ).rejects.toThrow(AppError);

    try {
      await authService.create({
        name: "Test User",
        email: "test@example.com",
        password: "123456",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).statusCode).toBe(400);
    }
  });

  it("should login successfully with correct password", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "693991789c031cc034ff0c0a",
      name: "Test User",
      email: "test@example.com",
      password: "$2a$10$hashedpassword",
      roleId: "693991789c031cc034ff0c0b",
      createdAt: new Date(),
    });

    vi.mocked(prisma.role.findUnique).mockResolvedValue({
      id: "693991789c031cc034ff0c0b",
      name: "USER",
      createdAt: new Date(),
    });

    const result = await authService.login("test@example.com", "123456");

    expect(result.token).toBe("jwt-token");
    expect(result.user.email).toBe("test@example.com");
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
  });

  it("should throw 401 with wrong password", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "693991789c031cc034ff0c0a",
      name: "Test User",
      email: "test@example.com",
      password: "$2a$10$hashedpassword",
      roleId: "693991789c031cc034ff0c0b",
      createdAt: new Date(),
    });

    vi.mocked(bcrypt.compare).mockResolvedValueOnce(false as never);

    await expect(
      authService.login("test@example.com", "wrongpass")
    ).rejects.toThrow(AppError);

    try {
      await authService.login("test@example.com", "wrongpass");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).statusCode).toBe(401);
      expect((error as AppError).message).toBe("Email ou senha incorretos");
    }
  });

  it("should throw 404 if email not found", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    await expect(
      authService.login("notfound@example.com", "123456")
    ).rejects.toThrow(AppError);

    try {
      await authService.login("notfound@example.com", "123456");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).statusCode).toBe(404);
      expect((error as AppError).message).toBe("Usuário não encontrado!");
    }
  });
});