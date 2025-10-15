/* eslint-disable no-console */
import type { Context } from "hono";
import { AppError } from "../utils";

export const errorHandler = (error: Error, context: Context) => {
  if (error instanceof AppError) {
    return context.json(
      {
        message: error.message,
      },
      error.statusCode
    );
  }

  console.error(error);

  return context.json(
    {
      success: false,
      message: error.message || "Erro interno do servidor",
    },
    500
  );
};
