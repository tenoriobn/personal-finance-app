import { Hono } from "hono";
import { roleController } from "./role.controller";
import { authorize } from "../../middleware/authorize";

export const roleRoutes = new Hono();

roleRoutes.get("/", authorize(["ADMIN"]), (context) => roleController.findAll(context));
roleRoutes.get("/:id", authorize(["ADMIN"]), (context) => roleController.getById(context));
roleRoutes.post("/", authorize(["ADMIN"]), (context) => roleController.create(context));
roleRoutes.put("/:id", authorize(["ADMIN"]), (context) => roleController.update(context));
roleRoutes.delete("/:id", authorize(["ADMIN"]), (context) => roleController.delete(context));
