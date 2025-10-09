import { prisma } from "@/src/config/prisma";
import { CreateTransactionDTO } from "./transaction.type";
import { transactionSelect } from "./transaction.select";
import { getEntityOrFail } from "@/src/utils/dbHelpers";

class TransactionService {
  async getAll(userId: string) {
    return prisma.transaction.findMany({
      where: { userId },
      select: transactionSelect
    });
  }

  async getById(id: string, userId: string) {
    return await getEntityOrFail(
      prisma.transaction, 
      { id, userId }, 
      "Transaction não encontrado!", 
      { select: transactionSelect }
    );
  }

  async create(data: CreateTransactionDTO, userId: string) {
    await getEntityOrFail(prisma.user, { id: userId }, "Usuário não encontrado!");

    if (data.budgetId) {
      await getEntityOrFail(prisma.budget, { id: data.budgetId, userId: data.userId }, "Budget não encontrado!");
    }

    return prisma.transaction.create({ data });
  }

  async update(id: string, data: Partial<CreateTransactionDTO>, userId: string) {
    await getEntityOrFail(
      prisma.transaction, 
      { id, userId }, 
      "Transaction não encontrado!", 
      { select: transactionSelect }
    );

    if (data.userId) {
      await getEntityOrFail(prisma.user, { id: userId }, "Usuário não encontrado!");
    }

    if (data.budgetId) {
      await getEntityOrFail(prisma.budget, { id: data.budgetId, userId }, "Budget não encontrado!");
    }

    return prisma.transaction.update({ where: { id }, data });
  }

  async delete(id: string, userId: string) {
    await getEntityOrFail(prisma.transaction, { id, userId }, "Transaction não encontrado!");

    return prisma.transaction.delete({ where: { id } });
  }
}

export const transactionService = new TransactionService();