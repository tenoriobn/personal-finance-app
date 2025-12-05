import { prisma } from "src/config/prisma";
import { CurrentUserDTO } from "src/types/user.type";
import { getPotsSummarySelect, getTransactionsSummarySelect, getBudgetsSummarySelect } from "./overview.select";

class OverviewService {
  private async getPotsSummary(currentUser: CurrentUserDTO) {
    const where = currentUser.role === "ADMIN" ? {} : { userId: currentUser.id };

    const pots = await prisma.pot.findMany({
      where,
      select: getPotsSummarySelect,
      orderBy: { createdAt: "desc" },
    });

    let totalPotsAmount = 0;
    for (const pot of pots) {
      totalPotsAmount += pot.totalAmount;
    }

    return {
      totalPotsAmount,
      pots: pots.slice(0, 6),
    };
  }

  private async getTransactionsSummary(currentUser: CurrentUserDTO) {
    const transactions = await prisma.transaction.findMany({
      where: { userId: currentUser.id },
      select: getTransactionsSummarySelect,
    });

    let income = 0;
    let expenses = 0;

    for (const transaction of transactions) {
      const amount = transaction.amount;

      if (amount > 0) {
        income += amount;
      } else {
        expenses += -amount;
      }
    }

    const currentBalance = income - expenses;

    return {
      currentBalance,
      income,
      expenses,
      transactions: transactions.slice(0, 5),
    };
  }

  private async getBudgetsSummary(currentUser: CurrentUserDTO) {
    const budgets = await prisma.budget.findMany({
      where: { userId: currentUser.id },
      select: getBudgetsSummarySelect,
    });

    let maximumSpendTotal = 0;
    let amountTransactionTotal = 0;

    for (const budget of budgets) {
      maximumSpendTotal += budget.maximumSpend ?? 0;

      for (const transaction of budget.transactions) {
        amountTransactionTotal += transaction.amount;
      }
    }

    return {
      maximumSpendTotal,
      amountTransactionTotal,
      budgets: budgets.slice(0, 5),
    };
  }

  private async getRecurringBillsSummary(currentUser: CurrentUserDTO) {
    const now = new Date();
    const today = now.getDate();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const bills = await prisma.transaction.findMany({
      where: {
        userId: currentUser.id,
        recurring: true,
        date: { gte: firstDay, lte: lastDay },
      },
      select: { amount: true, date: true },
    });

    let paidBills = 0;
    let dueSoon = 0;
    let upcoming = 0;

    for (const bill of bills) {
      const billDay = bill.date.getDate();
      const amount = bill.amount < 0 ? -bill.amount : bill.amount;

      if (billDay <= today) {
        paidBills += amount;
      } else if (billDay <= today + 5) {
        dueSoon += amount;
      } else {
        upcoming += amount;
      }
    }

    return { paidBills, dueSoon, upcoming };
  }

  async getAll(currentUser: CurrentUserDTO) {
    const pots = await this.getPotsSummary(currentUser);
    const transactions = await this.getTransactionsSummary(currentUser);
    const budgets = await this.getBudgetsSummary(currentUser);
    const recurringBills = await this.getRecurringBillsSummary(currentUser);

    return {
      transactions,
      pots,
      budgets,
      recurringBills,
    };
  }
}

export const overviewService = new OverviewService();
