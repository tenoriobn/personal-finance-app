import { Hono } from "hono";
import { authController } from "./auth.controller";

export const authRoutes = new Hono();

authRoutes.post("/", (context) => authController.login(context));
