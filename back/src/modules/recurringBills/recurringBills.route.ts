import { Hono } from "hono";
import { recurringBillsController } from "./recurringBills.controller";

export const recurringBillsRoutes = new Hono();

recurringBillsRoutes.get("/", (context) => recurringBillsController.getAll(context));
