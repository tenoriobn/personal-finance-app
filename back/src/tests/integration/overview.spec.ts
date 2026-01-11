import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";
import type { CurrentUserDTO } from "src/types/user.type";

vi.mock("src/config/prisma", () => ({
  prisma: {
    pot: {
      findMany: vi.fn(),
    },
    transaction: {
      findMany: vi.fn(),
    },
    budget: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("src/modules/overview/overview.select", () => ({
  getPotsSummarySelect: {},
  getTransactionsSummarySelect: {},
  getBudgetsSummarySelect: {},
}));

import { prisma } from "src/config/prisma";
import { overviewRoutes } from "src/modules/overview/overview.route";

type AppVariables = {
  Variables: {
    user: CurrentUserDTO;
  };
};

describe("Overview Integration (route → controller → service)", () => {
  let app: Hono<AppVariables>;

  beforeEach(() => {
    vi.clearAllMocks();

    app = new Hono<AppVariables>();

    app.use("/overview/*", async (c, next) => {
      const user: CurrentUserDTO = {
        id: "user-id",
        role: "USER",
      };

      c.set("user", user);
      await next();
    });

    app.route("/overview", overviewRoutes);
  });

  it("Should return overview summary for authenticated user", async () => {
    vi.mocked(prisma.pot.findMany).mockResolvedValue([
      {
        id: "pot-1",
        name: "Pot 1",
        normalizedName: "pot-1",
        targetAmount: 1000,
        totalAmount: 100,
        createdAt: new Date(),
        userId: "user-id",
        themeId: "theme-id",
      },
      {
        id: "pot-2",
        name: "Pot 2",
        normalizedName: "pot-2",
        targetAmount: 2000,
        totalAmount: 200,
        createdAt: new Date(),
        userId: "user-id",
        themeId: "theme-id",
      },
    ]);

    vi.mocked(prisma.transaction.findMany)
      .mockResolvedValueOnce([
        {
          id: "tx-1",
          name: "Income",
          userId: "user-id",
          date: new Date(),
          amount: 500,
          recurring: false,
          budgetId: "budget-id",
        },
        {
          id: "tx-2",
          name: "Expense 1",
          userId: "user-id",
          date: new Date(),
          amount: -200,
          recurring: false,
          budgetId: "budget-id",
        },
        {
          id: "tx-3",
          name: "Expense 2",
          userId: "user-id",
          date: new Date(),
          amount: -100,
          recurring: false,
          budgetId: "budget-id",
        },
      ])
      .mockResolvedValueOnce([
        {
          id: "bill-1",
          name: "Internet",
          userId: "user-id",
          date: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          ),
          amount: -50,
          recurring: true,
          budgetId: "budget-id",
        },
      ]);

    vi.mocked(prisma.budget.findMany).mockResolvedValue([
      {
        id: "budget-1",
        userId: "user-id",
        themeId: "theme-id",
        maximumSpend: 500,
        categoryId: "category-id",
      },
    ]);

    const response = await app.request("/overview");
    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body).toEqual({
      pots: {
        totalPotsAmount: 300,
        pots: [
          expect.objectContaining({ id: "pot-1", totalAmount: 100 }),
          expect.objectContaining({ id: "pot-2", totalAmount: 200 }),
        ],
      },
      transactions: {
        currentBalance: 200,
        income: 500,
        expenses: 300,
        transactions: expect.any(Array),
      },
      budgets: [
        expect.objectContaining({
          id: "budget-1",
        }),
      ],
      recurringBills: {
        paidBills: 50,
        dueSoon: 0,
        upcoming: 0,
      },
    });

    expect(prisma.pot.findMany).toHaveBeenCalled();
    expect(prisma.transaction.findMany).toHaveBeenCalledTimes(2);
    expect(prisma.budget.findMany).toHaveBeenCalled();
  });
});
