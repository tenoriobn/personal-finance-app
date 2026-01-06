import { Hono } from "hono";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./middleware/logger";
import { corsMiddleware } from "./middleware/cors";
import { registerRoutes } from "./routes/registerRoutes";

const app = new Hono();

app.use("*", logger);
app.use("*", corsMiddleware);

app.onError(errorHandler);

registerRoutes(app);

export default app;
