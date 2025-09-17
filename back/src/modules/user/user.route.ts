import { Hono } from "hono";
import { userController } from "./user.controller";
import { validateId } from "src/middleware/validateId";

export const userRoutes = new Hono();

userRoutes.get("/", (context) => userController.getAll(context));
userRoutes.get("/:id", validateId, (context) => userController.getById(context));
userRoutes.post("/", (context) => userController.create(context));
userRoutes.put("/:id", validateId, (context) => userController.update(context));
userRoutes.delete("/:id", validateId, (context) => userController.delete(context));
