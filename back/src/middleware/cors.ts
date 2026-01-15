import { cors } from "hono/cors";

const allowedOrigins = [
  "https://app-personal-finance.vercel.app/",
  /^https:\/\/app-personal-finance-[a-z0-9-]+\.vercel\.app$/
];

const vercelPreviewRegex = /^https:\/\/app-personal-finance-[a-z0-9-]+\.vercel\.app$/;

export const corsMiddleware = cors({
  origin: (origin) => {
    if (!origin) { return null; }

    const isDev = process.env.NODE_ENV === "development";
    if (isDev) {
      allowedOrigins.push("http://localhost:3000");
    }

    if (allowedOrigins.includes(origin)) {
      return origin;
    }

    if (vercelPreviewRegex.test(origin)) {
      return origin;
    }

    return null;
  },
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});