vi.mock("src/modules/auth/auth.service", () => ({
  authService: {
    create: vi.fn(),
    login: vi.fn(),
  },
}));

vi.mock("src/modules/auth/auth.schema", () => ({
  createAuthSchema: {
    safeParse: vi.fn(),
  },
}));

vi.mock("src/modules/user/user.schema", () => ({
  createUserSchema: {
    safeParse: vi.fn(),
  },
}));

import { describe, it, expect, vi, beforeEach } from "vitest";
import { authController } from "src/modules/auth/auth.controller";
import { authService } from "src/modules/auth/auth.service";
import { createAuthSchema } from "src/modules/auth/auth.schema";
import { createUserSchema } from "src/modules/user/user.schema";
import type { Context } from "hono";

const createMockContext = (body: unknown): Context =>
  ({
    req: {
      json: vi.fn().mockResolvedValue(body),
    },
    json: vi.fn(),
  } as unknown as Context);

describe("AuthController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("Should return 400 when body validation fails", async () => {
      vi.mocked(createUserSchema.safeParse).mockReturnValue({
        success: false,
        error: { issues: [] },
      } as never);

      const context = createMockContext({});

      await authController.create(context);

      expect(context.json).toHaveBeenCalledWith(
        { error: expect.any(Object) },
        400
      );

      expect(authService.create).not.toHaveBeenCalled();
    });

    it("Should create a user and return 201", async () => {
      const body = {
        name: "Bruno",
        email: "bruno@email.com",
        password: "123456",
        roleId: "role-id",
      };

      const parsedBody = {
        name: body.name,
        email: body.email,
        password: body.password,
      };

      const serviceResponse = {
        user: {
          id: "user-id",
          name: "Bruno",
          email: body.email,
          role: "USER",
        },
        token: "jwt-token",
      };

      vi.mocked(createUserSchema.safeParse).mockReturnValue({
        success: true,
        data: parsedBody,
      });

      vi.mocked(authService.create).mockResolvedValue(serviceResponse);

      const context = createMockContext(body);

      await authController.create(context);

      expect(authService.create).toHaveBeenCalledWith(parsedBody);
      expect(context.json).toHaveBeenCalledWith(serviceResponse, 201);
    });
  });

  describe("login", () => {
    it("Should return 400 when credentials are invalid", async () => {
      vi.mocked(createAuthSchema.safeParse).mockReturnValue({
        success: false,
        error: { issues: [] },
      } as never);

      const context = createMockContext({
        email: "invalid-email",
        password: "",
      });

      await authController.login(context);

      expect(context.json).toHaveBeenCalledWith(
        { error: expect.any(Object) },
        400
      );

      expect(authService.login).not.toHaveBeenCalled();
    });

    it("Should login successfully and return auth data", async () => {
      const body = {
        email: "bruno@email.com",
        password: "123456",
      };

      const loginResult = {
        user: {
          id: "user-id",
          name: "Bruno",
          email: body.email,
          role: "USER",
        },
        token: "jwt-token",
      };

      vi.mocked(createAuthSchema.safeParse).mockReturnValue({
        success: true,
        data: body,
      });

      vi.mocked(authService.login).mockResolvedValue(loginResult);

      const context = createMockContext(body);

      await authController.login(context);

      expect(authService.login).toHaveBeenCalledWith(
        body.email,
        body.password
      );
      expect(context.json).toHaveBeenCalledWith(loginResult);
    });
  });
});
