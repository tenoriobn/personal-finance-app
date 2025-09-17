/* eslint-disable no-console */
import { Hono } from "hono";
import { userRoutes } from "./modules/user/user.route";
import { errorHandler } from "./middleware/errorHandler";

const app = new Hono();

app.use("*", async (context, next) => {
  console.log(`[${context.req.method}] ${context.req.url}`);
  await next();
});

app.onError(errorHandler);

app.route("/users", userRoutes);

export default app;
