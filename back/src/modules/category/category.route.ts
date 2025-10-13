import { Hono } from "hono";
import { categoryController } from "./category.controller";
import { validateId } from "src/middleware/validateId";
import { authorize } from "@/src/middleware/authorize";

export const categoryRoutes = new Hono();

categoryRoutes.get("/", (context) => categoryController.getAll(context));
categoryRoutes.get("/:id", validateId, (context) => categoryController.getById(context));
categoryRoutes.post("/", authorize(["ADMIN"]), (context) => categoryController.create(context));
categoryRoutes.put("/:id", authorize(["ADMIN"]), validateId, (context) => categoryController.update(context));
categoryRoutes.delete("/:id", authorize(["ADMIN"]), validateId, (context) => categoryController.delete(context));