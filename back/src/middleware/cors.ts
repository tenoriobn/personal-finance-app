import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: "http://localhost:3000",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});