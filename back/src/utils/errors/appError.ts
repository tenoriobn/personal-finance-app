import type { ContentfulStatusCode } from "hono/utils/http-status";

export class AppError extends Error {
  public readonly statusCode: ContentfulStatusCode;

  constructor(message: string, statusCode: ContentfulStatusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
