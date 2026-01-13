import { Hono } from "hono";
import { authController } from "./auth.controller";

export const authRoutes = new Hono();

authRoutes.post("/register", (context) => authController.create(context));
authRoutes.post("/login", (context) => authController.login(context));
authRoutes.post("/demo-login", (context) => authController.demoLogin(context));