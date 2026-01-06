import { PrismaClient } from "@prisma/client";

export interface CreateBudgetDTO {
  maximumSpend: number;
  themeId: string;
  categoryId: string;
}

type PrismaDelegateBudget = 
  | PrismaClient["user"]
  | PrismaClient["theme"]
  | PrismaClient["category"]
  | PrismaClient["budget"];

export type BudgetEntityCheck = [PrismaDelegateBudget, string | undefined, string];