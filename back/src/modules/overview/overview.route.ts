import { Hono } from "hono";
import { overviewController } from "./overview.controller";

export const overviewRoutes = new Hono();

overviewRoutes.get("/", (context) => overviewController.getAll(context));
