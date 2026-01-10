import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";
import { authService } from "src/modules/auth/auth.service";
import { AppError } from "src/utils";
import type { CreateUserDTO } from "src/modules/user/user.types";

vi.mock("src/config/prisma", () => ({
  prisma: {
    user: {
      create: vi.fn(),
    },
    role: {},
  },
}));

vi.mock("src/core", () => ({
  ensureUniqueOrFail: vi.fn(),
  findEntityOrFail: vi.fn(),
}));

vi.mock("src/utils", async () => {
  const actual = await vi.importActual<typeof import("src/utils")>("src/utils");
  return {
    ...actual,
    signToken: vi.fn(),
  };
});

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

import { prisma } from "src/config/prisma";
import { ensureUniqueOrFail, findEntityOrFail } from "src/core";
import { signToken } from "src/utils";

describe("AuthService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("Should create a user and return token and user data", async () => {
      const input: CreateUserDTO = {
        name: "USER",
        email: "test@email.com",
        password: "123456",
      };

      const hashedPassword = "hashed-password";

      const role = {
        id: "role-id",
        name: "USER",
      };

      const createdUser = {
        id: "user-id",
        name: "Test User",
        email: "test@email.com",
        password: "hashed-password",
        roleId: "role-id",
        createdAt: new Date(),
        role: {
          id: "role-id",
          name: "USER",
        },
      };

      vi.mocked(bcrypt.hash).mockImplementation(async () => hashedPassword);
      vi.mocked(findEntityOrFail).mockResolvedValueOnce(role);
      vi.mocked(prisma.user.create).mockResolvedValue(createdUser);
      vi.mocked(signToken).mockReturnValue("jwt-token");

      const result = await authService.create(input);

      expect(ensureUniqueOrFail).toHaveBeenCalledWith(
        expect.anything(),
        { email: input.email },
        "Este e-mail já está em uso!"
      );

      expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...input,
          password: hashedPassword,
          roleId: role.id,
        },
        include: { role: true },
      });

      expect(result).toEqual({
        token: "jwt-token",
        user: {
          id: createdUser.id,
          email: createdUser.email,
          role: role.name,
        },
      });
    });
  });

  describe("login", () => {
    it("Should authenticate user and return token and user data", async () => {
      const email = "test@email.com";
      const password = "123456";

      const user = {
        id: "user-id",
        email,
        password: "hashed-password",
        roleId: "role-id",
      };

      const role = {
        id: "role-id",
        name: "USER",
      };

      vi.mocked(findEntityOrFail)
        .mockResolvedValueOnce(user)
        .mockResolvedValueOnce(role);

      vi.mocked(bcrypt.compare).mockImplementation(async () => true);
      vi.mocked(signToken).mockReturnValue("jwt-token");

      const result = await authService.login(email, password);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);

      expect(result).toEqual({
        token: "jwt-token",
        user: {
          id: user.id,
          email: user.email,
          role: user.roleId,
        },
      });
    });

    it("Should throw error when password is invalid", async () => {
      const email = "test@email.com";
      const password = "wrong-password";

      const user = {
        id: "user-id",
        email,
        password: "hashed-password",
        roleId: "role-id",
      };

      vi.mocked(findEntityOrFail).mockResolvedValue(user);
      vi.mocked(bcrypt.compare).mockImplementation(async () => false);

      await expect(authService.login(email, password)).rejects.toBeInstanceOf(
        AppError
      );
    });
  });
});
