import z from "zod";

export const createThemeSchema = z.object({
  colorName: z
    .string({ required_error: "O campo 'color_name' é obrigatório!" }),
  colorHex: z
    .string({ required_error: "O campo 'color_hex' é obrigatório!" }),
});

export type CreateThemeInput = z.infer<typeof createThemeSchema>;