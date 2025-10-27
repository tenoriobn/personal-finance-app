import { cors } from "hono/cors";

const allowedOrigins = [
  "http://localhost:3000",
  "https://personal-finance-app-rosy.vercel.app",
  /^https:\/\/personal-finance-[a-z0-9-]+\.vercel\.app$/
];

const vercelPreviewRegex = /^https:\/\/personal-finance-[a-z0-9-]+\.vercel\.app$/;

export const corsMiddleware = cors({
  origin: (origin) => {
    if (!origin) { return null; }

    // Em dev, também permite localhost
    // const isDev = process.env.NODE_ENV === "development";
    // if (isDev) {
    //   allowedOrigins.push("http://localhost:3000");
    // }

    // Se o origin estiver na lista, permite
    if (allowedOrigins.includes(origin)) {
      return origin;
    }

    // Se for um preview válido da Vercel, permite
    if (vercelPreviewRegex.test(origin)) {
      return origin;
    }

    return null;
  },
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});