import { serve } from "@hono/node-server";
import app from "./server";

const port = 4000;
// eslint-disable-next-line no-console
console.log(`🚀 Server running at http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
