import { Hono } from "hono";
import { errorHandler } from "./middleware/errorHandler";
import { routes } from "./routes";
import { logger } from "./middleware/logger";

const app = new Hono();

app.use("*", logger);

app.onError(errorHandler);

routes.forEach(({ path, handler }) => {
  app.route(path, handler);
});

export default app;
