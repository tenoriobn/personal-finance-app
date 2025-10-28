import { prisma } from "src/config/prisma";
import { CreateTransactionDTO } from "./transaction.type";
import { transactionSelect } from "./transaction.select";
import { CurrentUserDTO, TransactionQuery } from "src/types/user.type";
import { findOrFail } from "src/core";
import { Prisma } from "@prisma/client";

class TransactionService {
  async getAll(currentUser: CurrentUserDTO, query: TransactionQuery) {
    const { search, categoryId, sort, page = 1, limit = 10 } = query;

    const where: Prisma.TransactionWhereInput = {
      ...(currentUser.role !== "ADMIN" && { userId: currentUser.id }),
    };

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }
    if (categoryId) {
      where.budget = { is: { categoryId } };
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
    default:
      orderBy = { date: "desc" };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [data, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy,
        skip,
        take,
        select: transactionSelect,
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      data,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / take),
    };
  }

  async getById(id: string, currentUser: CurrentUserDTO) {
    return findOrFail(
      prisma.transaction,
      { id },
      currentUser,
      { select: transactionSelect, checkOwnership: true, notFoundMessage: "Transação não encontrada!" }
    );
  }

  async create(data: CreateTransactionDTO, currentUser: CurrentUserDTO) {
    await findOrFail(
      prisma.user,
      { id: currentUser.id },
      currentUser,
      { notFoundMessage: "Usuário não encontrado!" }
    ); 

    if (data.budgetId) {
      await findOrFail(
        prisma.budget,
        { id: data.budgetId },
        currentUser,
        { notFoundMessage: "Budget não encontrado!" }
      );
    }

    const payload = { ...data, userId: currentUser.id };

    return prisma.transaction.create({ data: payload });
  }

  async update(id: string, data: Partial<CreateTransactionDTO>, currentUser: CurrentUserDTO) {
    await findOrFail(
      prisma.user,
      { id: currentUser.id },
      currentUser,
      { notFoundMessage: "Usuário não encontrado!" }
    ); 

    await findOrFail(
      prisma.transaction,
      { id },
      currentUser,
      { checkOwnership: true, notFoundMessage: "Transação não encontrada!" }
    ); 

    if (data.budgetId) {
      await findOrFail(
        prisma.budget,
        { id: data.budgetId },
        currentUser,
        { notFoundMessage: "Budget não encontrado!" }
      );
    }

    const payload = { ...data, userId: currentUser.id };

    return prisma.transaction.update({ where: { id }, data: payload });
  }

  async delete(id: string, currentUser: CurrentUserDTO) {
    await findOrFail(
      prisma.transaction,
      { id },
      currentUser,
      { checkOwnership: true, notFoundMessage: "Transação não encontrada!" }
    ); 

    return prisma.transaction.delete({ where: { id } });
  }
}

export const transactionService = new TransactionService();