/* eslint-disable no-console */
import { Hono } from "hono";
import { errorHandler } from "./middleware/errorHandler";
import { userRoutes } from "./modules/user/user.route";
import { categoryRoutes } from "./modules/category/category.route";

const app = new Hono();

app.use("*", async (context, next) => {
  console.log(`[${context.req.method}] ${context.req.url}`);
  await next();
});

app.onError(errorHandler);

app.route("/users", userRoutes);
app.route("/categories", categoryRoutes);

export default app;
