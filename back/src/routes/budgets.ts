import { Hono } from "hono";
import { prisma } from "../config/prisma.js";

export const budgetsRoute = new Hono();

budgetsRoute.get("/", async (c) => {
  const budgets = await prisma.budget.findMany();
  return c.json(budgets);
});

budgetsRoute.post("/", async (c) => {
  const body = await c.req.json<{ name: string; limit: number }>();
  const budget = await prisma.budget.create({
    data: {
      name: body.name,
      limit: body.limit,
    },
  });
  return c.json(budget, 201);
});
