import { prisma } from "src/config/prisma";
import { Prisma } from "@prisma/client";
import { RecurringBillsQuery, RecurringBillsResponse, RecurringBillDTO } from "./recurringBills.types";
import { CurrentUserDTO } from "src/types/user.type";

class RecurringBillsService {
  async getAll(user: CurrentUserDTO, query: RecurringBillsQuery): Promise<RecurringBillsResponse> {
    const { search, sort, page = 1, limit = 10 } = query;

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const baseWhere: Prisma.TransactionWhereInput = {
      userId: user.id,
      recurring: true,
      date: { gte: firstDay, lte: lastDay },
    };

    const filteredWhere: Prisma.TransactionWhereInput = {
      ...baseWhere,
    };

    if (search) {
      filteredWhere.name = { contains: search, mode: "insensitive" };
    }

    let orderBy: Prisma.TransactionOrderByWithRelationInput = { date: "desc" };

    switch (sort) {
    case "Mais antigo":
      orderBy = { date: "asc" };
      break;
    case "A a Z":
      orderBy = { name: "asc" };
      break;
    case "Z a A":
      orderBy = { name: "desc" };
      break;
    case "Mais alto":
      orderBy = { amount: "desc" };
      break;
    case "Mais baixo":
      orderBy = { amount: "asc" };
      break;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const allTransactions = await prisma.transaction.findMany({
      where: baseWhere,
      select: {
        id: true,
        name: true,
        date: true,
        amount: true,
      },
    });

    const paginatedTransactions = await prisma.transaction.findMany({
      where: filteredWhere,
      orderBy,
      skip,
      take,
      select: {
        id: true,
        name: true,
        date: true,
        amount: true,
      },
    });

    const total = await prisma.transaction.count({
      where: filteredWhere,
    });

    const allBills = allTransactions.map((t) => {
      const isoDate = t.date.toISOString();
      return {
        id: t.id,
        name: t.name,
        date: isoDate,
        amount: Math.abs(t.amount),
        status: this.getStatus(isoDate, now),
      };
    });

    const paginatedBills = paginatedTransactions.map((t) => {
      const isoDate = t.date.toISOString();
      return {
        id: t.id,
        name: t.name,
        date: isoDate,
        amount: Math.abs(t.amount),
        status: this.getStatus(isoDate, now),
      };
    });

    const summary = this.buildSummary(allBills, now);

    return {
      data: paginatedBills,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      summary,
    };
  }


  private getStatus(date: string, reference: Date): "paid" | "dueSoon" | "upcoming" {
    const billDate = new Date(date).getDate();
    const today = reference.getDate();

    if (billDate <= today) {
      return "paid";
    }

    if (billDate > today && billDate <= today + 5) {
      return "dueSoon";
    }

    return "upcoming";
  }

  private buildSummary(bills: RecurringBillDTO[], reference: Date) {
    const today = reference.getDate();

    let paidBills = 0;
    let dueSoon = 0;
    let upcoming = 0;

    bills.forEach((b) => {
      const billDate = new Date(b.date).getDate();

      if (billDate <= today) {
        paidBills += b.amount;
      } 
      else if (billDate > today && billDate <= today + 5) {
        dueSoon += b.amount;
      } 
      else {
        upcoming += b.amount;
      }
    });

    const totalBills = bills.reduce((acc, item) => acc + item.amount, 0);

    return {
      totalBills,
      paidBills,
      dueSoon,
      upcoming,
    };
  }
}

export const recurringBillsService = new RecurringBillsService();
