import { Hono } from "hono";
import { prisma } from "../config/prisma.js";

export const usersRoute = new Hono();

usersRoute.get("/", async (c) => {
  const users = await prisma.user.findMany();
  return c.json(users);
});

usersRoute.post("/", async (c) => {
  const body = await c.req.json<{ name: string; email: string; password: string }>();

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: body.password,
    },
  });

  return c.json(user, 201);
});
