/* eslint-disable no-console */
import "dotenv/config";
import { serve } from "@hono/node-server";
import app from "./server";

const port = Number(process.env.PORT) || 4000;

console.log(`🚀 Server running at http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
