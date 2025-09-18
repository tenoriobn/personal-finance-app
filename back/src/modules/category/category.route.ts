import { Hono } from "hono";
import { categoryController } from "./category.controller";
import { validateId } from "src/middleware/validateId";

export const categoryRoutes = new Hono();

categoryRoutes.get("/", (context) => categoryController.getAll(context));
categoryRoutes.get("/:id", validateId, (context) => categoryController.getById(context));
categoryRoutes.post("/", (context) => categoryController.create(context));
categoryRoutes.put("/:id", validateId, (context) => categoryController.update(context));
categoryRoutes.delete("/:id", validateId, (context) => categoryController.delete(context));