import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";

vi.mock("src/modules/overview/overview.controller", () => ({
  overviewController: {
    getAll: vi.fn(),
  },
}));

import { overviewRoutes } from "src/modules/overview/overview.route";
import { overviewController } from "src/modules/overview/overview.controller";

describe("OverviewRoutes", () => {
  let app: Hono;

  beforeEach(() => {
    vi.clearAllMocks();
    app = new Hono();
    app.route("/overview", overviewRoutes);
  });

  it("Should call overviewController.getAll when GET /overview is requested", async () => {
    vi.mocked(overviewController.getAll).mockImplementation(async (ctx) => {
      return ctx.json(
        {
          transactions: {
            currentBalance: 0,
            income: 0,
            expenses: 0,
            transactions: [],
          },
          pots: {
            totalPotsAmount: 0,
            pots: [],
          },
          budgets: [],
          recurringBills: {
            paidBills: 0,
            dueSoon: 0,
            upcoming: 0,
          },
        },
        200
      );
    });

    const response = await app.request("/overview");

    expect(overviewController.getAll).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
  });
});
