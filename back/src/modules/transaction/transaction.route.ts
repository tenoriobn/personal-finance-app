import { Hono } from "hono";
import { transactionController } from "./transaction.controller";
import { validateId } from "src/middleware/validateId";

export const transactionRoutes = new Hono();

transactionRoutes.get("/", (context) => transactionController.getAll(context));
transactionRoutes.get("/:id", validateId, (context) => transactionController.getById(context));
transactionRoutes.post("/", (context) => transactionController.create(context));
transactionRoutes.put("/:id", validateId, (context) => transactionController.update(context));
transactionRoutes.delete("/:id", validateId, (context) => transactionController.delete(context));