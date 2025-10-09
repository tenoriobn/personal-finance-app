import { Hono } from "hono";
import { errorHandler } from "./middleware/errorHandler";
import { registerRoutes } from "./routes";
import { logger } from "./middleware/logger";

const app = new Hono();

app.use("*", logger);

app.onError(errorHandler);

registerRoutes(app);

export default app;
