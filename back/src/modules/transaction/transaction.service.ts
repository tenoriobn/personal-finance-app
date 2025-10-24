import { prisma } from "src/config/prisma";
import { CreateTransactionDTO } from "./transaction.type";
import { transactionSelect } from "./transaction.select";
import { CurrentUserDTO } from "src/types/user.type";
import { findOrFail } from "src/core";

class TransactionService {
  async getAll(currentUser: CurrentUserDTO) {
    const where = currentUser.role === "ADMIN" ? {} : { userId: currentUser.id };

    return prisma.transaction.findMany({
      where,
      select: transactionSelect
    });
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

    // await getEntityOrFail(prisma.user, { id: data.userId }, "Usuário não encontrado!");

    if (data.budgetId) {
      // await getEntityOrFail(prisma.budget, { id: data.budgetId, userId: currentUser.id }, "Budget não encontrado!");

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