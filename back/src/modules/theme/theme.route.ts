import { Hono } from "hono";
import { themeController } from "./theme.controller";
import { validateId } from "@/src/middleware/validateId";

export const themeRoutes = new Hono();

themeRoutes.get("/", (context) => themeController.getAll(context));
themeRoutes.get("/:id", validateId, (context) => themeController.getById(context));
themeRoutes.post("/", (context) => themeController.create(context));
themeRoutes.put("/:id", validateId, (context) => themeController.update(context));
themeRoutes.delete("/:id", validateId, (context) => themeController.delete(context));