import { Hono } from "hono";
import { userController } from "./user.controller";
import { validateId } from "src/middleware/validateId";
import { authorize } from "src/middleware/authorize";

export const userRoutes = new Hono();

userRoutes.get("/", (context) => userController.getAll(context));
userRoutes.get("/:id", validateId, (context) => userController.getById(context));
userRoutes.put("/:id", validateId, (context) => userController.update(context));
userRoutes.delete("/:id", validateId, (context) => userController.delete(context));
userRoutes.put("/:id/role", authorize(["ADMIN"]), (context) => userController.updateRole(context));
