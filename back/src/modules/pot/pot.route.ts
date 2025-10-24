import { validateId } from "src/middleware/validateId";
import { Hono } from "hono";
import { potController } from "./pot.controller";

export const potRoutes = new Hono();

potRoutes.get("/", (context) => potController.getAll(context));
potRoutes.get("/:id", validateId, (context) => potController.getById(context));
potRoutes.post("/", (context) => potController.create(context));
potRoutes.put("/:id", validateId, (context) => potController.update(context));
potRoutes.delete("/:id", validateId, (context) => potController.delete(context));