/* eslint-disable no-console */
import { MiddlewareHandler } from "hono";

export const logger: MiddlewareHandler = async (context, next) => {
  console.log(`[${context.req.method}] ${context.req.url}`);
  await next();
};
