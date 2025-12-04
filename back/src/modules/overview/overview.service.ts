import { prisma } from "src/config/prisma";
import { CurrentUserDTO } from "src/types/user.type";
import { buildPotsSummarySelect, buildTransactionsSummarySelect } from "./overview.select";

class OverviewService {
  private async buildPotsSummary(currentUser: CurrentUserDTO) {
    const where = currentUser.role === "ADMIN" ? {} : { userId: currentUser.id };

    const pots =  await prisma.pot.findMany({
      where,
      select: buildPotsSummarySelect,
      orderBy: { createdAt: "desc" },
    });

    const totalAmount = pots.reduce((acc, pot) => acc + pot.totalAmount, 0);

    return {
      totalAmount,
      pots: pots.slice(0, 6)
    };
  }

  private async buildTransactionsSummary(currentUser: CurrentUserDTO) {
    const transactions = await prisma.transaction.findMany({
      where: { userId: currentUser.id },
      select: buildTransactionsSummarySelect,
    });

    const { income, expenses } = transactions.reduce((acc, transaction) => {
      if (transaction.amount > 0) { 
        acc.income += transaction.amount; 
      } else { 
        acc.expenses += Math.abs(transaction.amount); 
      }

      return acc;
    }, { income: 0, expenses: 0 });

    const currentBalance = income - expenses;

    return {
      currentBalance,
      income,
      expenses,
      transactions: transactions.slice(0, 5),
    };
  }

  async getAll(currentUser: CurrentUserDTO) {
    const pots = await this.buildPotsSummary(currentUser);
    const transactions = await this.buildTransactionsSummary(currentUser);

    return {
      transactions,
      pots,
    };
  }
}

export const overviewService = new OverviewService();
