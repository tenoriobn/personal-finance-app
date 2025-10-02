import { prisma } from "@/src/config/prisma";
import { CreateTransactionDTO } from "./transaction.type";
import { transactionSelect } from "./transaction.select";
import { getEntityOrFail } from "@/src/utils/dbHelpers";

class TransactionService {
  async getAll() {
    return prisma.transaction.findMany({
      select: transactionSelect
    });
  }

  async getById(id: string) {
    return await getEntityOrFail(prisma.transaction, { id }, "Transaction não encontrado!", { select: transactionSelect });
  }

  async create(data: CreateTransactionDTO) {
    await getEntityOrFail(prisma.user, data.userId, "Usuário não encontrado!");
    
    if (data.budgetId) {
      await getEntityOrFail(prisma.budget, { id: data.budgetId }, "Budget não encontrado!");
    }

    return prisma.transaction.create({ data });
  }

  async update(id: string, data: Partial<CreateTransactionDTO>) {
    await getEntityOrFail(prisma.transaction, { id }, "Transaction não encontrado!", { select: transactionSelect });

    if (data.userId) {
      await getEntityOrFail(prisma.user, { id: data.userId }, "Usuário não encontrado!");
    }

    if (data.budgetId) {
      await getEntityOrFail(prisma.budget, { id: data.budgetId }, "Budget não encontrado!");
    }

    return prisma.transaction.update({ where: { id }, data });
  }

  async delete(id: string) {
    await getEntityOrFail(prisma.transaction, { id }, "Transaction não encontrado!");
    
    return prisma.transaction.delete({ where: { id } });
  }
}

export const transactionService = new TransactionService();