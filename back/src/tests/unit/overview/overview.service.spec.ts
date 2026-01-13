/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { overviewService } from "src/modules/overview/overview.service";
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

describe("OverviewService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("Should return overview summary for a regular user", async () => {
      const currentUser: CurrentUserDTO = {
        id: "user-id",
        role: "USER",
      };

      vi.mocked(prisma.pot.findMany).mockResolvedValue([
        { id: "pot-1", totalAmount: 100 },
        { id: "pot-2", totalAmount: 200 },
      ] as any);

      vi.mocked(prisma.transaction.findMany)
        .mockResolvedValueOnce([
          { amount: 500 },
          { amount: -200 },
          { amount: -100 },
        ] as any)
        .mockResolvedValueOnce([
          {
            amount: -50,
            date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
          },
        ] as any);

      vi.mocked(prisma.budget.findMany).mockResolvedValue([
        { id: "budget-1" },
      ] as any);

      const result = await overviewService.getAll(currentUser);

      expect(prisma.pot.findMany).toHaveBeenCalledWith({
        where: { userId: currentUser.id },
        select: expect.any(Object),
        orderBy: { createdAt: "desc" },
      });

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: currentUser.id },
        select: expect.any(Object),
      });

      expect(prisma.budget.findMany).toHaveBeenCalledWith({
        where: { userId: currentUser.id },
        select: expect.any(Object),
      });

      expect(result).toEqual({
        pots: {
          totalPotsAmount: 300,
          pots: [
            { id: "pot-1", totalAmount: 100 },
            { id: "pot-2", totalAmount: 200 },
          ],
        },
        transactions: {
          currentBalance: 200,
          income: 500,
          expenses: 300,
          transactions: [
            { amount: 500 },
            { amount: -200 },
            { amount: -100 },
          ],
        },
        budgets: [{ id: "budget-1" }],
        recurringBills: {
          paidBills: 50,
          dueSoon: 0,
          upcoming: 0,
        },
      });
    });

    it("Should return all pots when user is ADMIN", async () => {
      const currentUser: CurrentUserDTO = {
        id: "admin-id",
        role: "ADMIN",
      };

      vi.mocked(prisma.pot.findMany).mockResolvedValue([
        { id: "pot-1", totalAmount: 100 },
      ] as any);

      vi.mocked(prisma.transaction.findMany)
        .mockResolvedValueOnce([] as any)
        .mockResolvedValueOnce([] as any);

      vi.mocked(prisma.budget.findMany).mockResolvedValue([] as any);

      const result = await overviewService.getAll(currentUser);

      expect(prisma.pot.findMany).toHaveBeenCalledWith({
        where: {},
        select: expect.any(Object),
        orderBy: { createdAt: "desc" },
      });

      expect(result.pots.totalPotsAmount).toBe(100);
    });
  });
});
