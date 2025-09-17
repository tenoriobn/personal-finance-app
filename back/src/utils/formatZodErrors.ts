import { ZodError } from "zod";

export function formatZodErrors(error: ZodError) {
  const formatted: Record<string, string> = {};
  
  error.issues.forEach((issue) => {
    const key = issue.path[0] as string;
    formatted[key] = issue.message;
  });

  return formatted;
}
