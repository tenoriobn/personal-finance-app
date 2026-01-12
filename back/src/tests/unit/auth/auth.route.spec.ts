import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";

vi.mock("src/modules/auth/auth.controller", () => ({
  authController: {
    create: vi.fn(),
    login: vi.fn(),
  },
}));

import { authRoutes } from "src/modules/auth/auth.routes";
import { authController } from "src/modules/auth/auth.controller";

describe("AuthRoutes", () => {
  let app: Hono;

  beforeEach(() => {
    vi.clearAllMocks();
    app = new Hono();
    app.route("/auth", authRoutes);
  });

  it("POST /auth/register should call authController.create", async () => {
    vi.mocked(authController.create).mockImplementation(async (ctx) => {
      return ctx.json({ user: { id: "1", email: "bruno@email.com", role: "user" }, token: "jwt-token" }, 201);
    });

    const response = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Bruno",
        email: "bruno@email.com",
        password: "123456",
      }),
    });

    expect(authController.create).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(201);
  });

  it("POST /auth/login should call authController.login", async () => {
    vi.mocked(authController.login).mockImplementation(async (ctx) => {
      return ctx.json({ user: { id: "1", email: "bruno@email.com", role: "user" }, token: "jwt-token" }, 200);
    });

    const response = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "bruno@email.com",
        password: "123456",
      }),
    });

    expect(authController.login).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
  });
});