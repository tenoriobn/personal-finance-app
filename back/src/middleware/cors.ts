import { cors } from "hono/cors";

const allowedOrigins = [
  "http://localhost:3000",
  "https://app-personal-finance.vercel.app",
];

const vercelPreviewRegex =
  /^https:\/\/app-personal-finance-[a-z0-9-]+\.vercel\.app$/;

export const corsMiddleware = cors({
  origin: (origin) => {
    if (!origin) {
      return undefined;
    }

    if (allowedOrigins.includes(origin)) {
      return origin;
    }

    if (vercelPreviewRegex.test(origin)) {
      return origin;
    }

    return undefined;
  },
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
