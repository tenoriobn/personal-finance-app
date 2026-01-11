// overview.controller.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Context } from "hono";

vi.mock("src/modules/overview/overview.service", () => ({
  overviewService: {
    getAll: vi.fn(),
  },
}));

import { overviewController } from "src/modules/overview/overview.controller";
import { overviewService } from "src/modules/overview/overview.service";

const createMockContext = (user: unknown): Context =>
  ({
    get: vi.fn().mockReturnValue(user),
    json: vi.fn(),
  } as unknown as Context);

describe("OverviewController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("Should call overviewService.getAll with the authenticated user", async () => {
      const user = { id: "user-id" };

      const serviceResponse = {
        transactions: {
          currentBalance: 1000,
          income: 2000,
          expenses: 1000,
          transactions: [],
        },
        pots: {
          totalPotsAmount: 500,
          pots: [],
        },
        budgets: [],
        recurringBills: {
          paidBills: 1,
          dueSoon: 0,
          upcoming: 2,
        },
      };

      vi.mocked(overviewService.getAll).mockResolvedValue(serviceResponse);

      const context = createMockContext(user);

      await overviewController.getAll(context);

      expect(overviewService.getAll).toHaveBeenCalledWith(user);
      expect(context.json).toHaveBeenCalledWith(serviceResponse, 200);
    });
  });
});
