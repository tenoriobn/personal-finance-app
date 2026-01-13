import { prisma } from "src/config/prisma";
import demoSeed from "./demo.seed.json";

export async function seedDemoUser(userId: string): Promise<void> {
  for (const budget of demoSeed.budgets) {
    const createdBudget = await prisma.budget.create({
      data: {
        userId,
        maximumSpend: budget.maximumSpend,
        categoryId: budget.category.id,
        themeId: budget.theme.id,
      },
    });

    await prisma.transaction.createMany({
      data: budget.transactions.map((transaction) => ({
        name: transaction.name,
        amount: transaction.amount,
        date: new Date(transaction.date),
        recurring: transaction.recurring,
        budgetId: createdBudget.id,
        userId,
      })),
    });
  }

  await prisma.pot.createMany({
    data: demoSeed.pots.map((pot) => ({
      name: pot.name,
      normalizedName: pot.name.toLowerCase().replace(/\s+/g, "-"),
      targetAmount: pot.targetAmount,
      totalAmount: pot.totalAmount,
      themeId: pot.theme.id,
      userId,
      createdAt: pot.createdAt ? new Date(pot.createdAt) : undefined,
    })),
  });
}

