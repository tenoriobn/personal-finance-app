import { Hono } from "hono";
import { themeController } from "./theme.controller";
import { validateId } from "src/middleware/validateId";
import { authorize } from "src/middleware/authorize";

export const themeRoutes = new Hono();

themeRoutes.get("/", (context) => themeController.getAll(context));
themeRoutes.get("/used/budget", (context) => themeController.getThemesUsedInBudgets(context));
themeRoutes.get("/available/budget", (context) => themeController.getThemesAvailableForBudgets(context));
themeRoutes.get("/used/pot", (context) => themeController.getThemesUsedInPots(context));
themeRoutes.get("/available/pot", (context) => themeController.getThemesAvailableForPots(context));
themeRoutes.get("/:id", validateId, (context) => themeController.getById(context));
themeRoutes.post("/", authorize(["ADMIN"]), (context) => themeController.create(context));
themeRoutes.put("/:id", authorize(["ADMIN"]), validateId, (context) => themeController.update(context));
themeRoutes.delete("/:id", authorize(["ADMIN"]), validateId, (context) => themeController.delete(context));