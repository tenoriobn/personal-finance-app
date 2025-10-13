import { prisma } from "@/src/config/prisma";
import { CreateTransactionDTO } from "./transaction.type";
import { transactionSelect } from "./transaction.select";
import { getEntityOrFail } from "@/src/utils/dbHelpers";
import { CurrentUserDTO } from "@/src/types/user.type";
import { resolveAccessFilter } from "@/src/utils/accessControl";

class TransactionService {
  async getAll(currentUser: CurrentUserDTO) {
    const where = resolveAccessFilter({ currentUser });

    return prisma.transaction.findMany({
      where,
      select: transactionSelect
    });
  }

  async getById(id: string, currentUser: CurrentUserDTO) {
    const where = resolveAccessFilter({ currentUser, resourceOwnerId: id });

    return await getEntityOrFail(
      prisma.transaction, 
      { id, userId: where }, 
      "Transaction não encontrado!", 
      { select: transactionSelect }
    );
  }

  async create(data: CreateTransactionDTO, currentUser: CurrentUserDTO) {
    resolveAccessFilter({ currentUser, resourceOwnerId: data.userId });

    await getEntityOrFail(prisma.user, { id: data.userId }, "Usuário não encontrado!");

    if (data.budgetId) {
      await getEntityOrFail(prisma.budget, { id: data.budgetId, userId: currentUser.id }, "Budget não encontrado!");
    }

    return prisma.transaction.create({ data });
  }

  async update(id: string, data: Partial<CreateTransactionDTO>, currentUser: CurrentUserDTO) {
    resolveAccessFilter({ currentUser, resourceOwnerId: id });

    await getEntityOrFail(
      prisma.transaction, 
      { id, userId: data.userId }, 
      "Transaction não encontrado!", 
      { select: transactionSelect }
    );

    if (data.userId) {
      await getEntityOrFail(prisma.user, { id: data.userId }, "Usuário não encontrado!");
    }

    if (data.budgetId) {
      await getEntityOrFail(prisma.budget, { id: data.budgetId, userId: currentUser.id }, "Budget não encontrado!");
    }

    return prisma.transaction.update({ where: { id }, data });
  }

  async delete(id: string, currentUser: CurrentUserDTO) {
    resolveAccessFilter({ currentUser, resourceOwnerId: id });

    await getEntityOrFail(prisma.transaction, { id }, "Transaction não encontrado!");

    return prisma.transaction.delete({ where: { id } });
  }
}

export const transactionService = new TransactionService();