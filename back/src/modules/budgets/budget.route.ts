import { Hono } from "hono";
import { budgetController } from "./budget.controller";
import { validateId } from "src/middleware/validateId";

export const budgetRoutes = new Hono();

budgetRoutes.get("/", (context) => budgetController.getAll(context));
budgetRoutes.get("/:id", validateId, (context) => budgetController.getById(context));
budgetRoutes.post("/", (context) => budgetController.create(context));
budgetRoutes.put("/:id", validateId, (context) => budgetController.update(context));
budgetRoutes.delete("/:id", validateId, (context) => budgetController.delete(context));