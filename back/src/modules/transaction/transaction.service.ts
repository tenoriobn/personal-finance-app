import { prisma } from "@/src/config/prisma";
import { CreateTransactionDTO } from "./transaction.type";
import { isValidObjectId } from "@/src/utils/objectId";
import AppError from "@/src/utils/appError";
import { transactionSelect } from "./transaction.select";


class TransactionService {
  private async getTransactionOrFail(id: string) {
    if (!isValidObjectId(id)) {
      throw new AppError("Formato de ID inválido!", 400);
    }
        
    const transaction = await prisma.transaction.findUnique({ 
      where: { id },
      select: transactionSelect,
    });

    if (!transaction) {
      throw new AppError("Transaction não encontrado!", 404);
    }

    return transaction;
  }

  private async getUserOrFail(id: string) {
    if (!isValidObjectId(id)) {
      throw new AppError("Formato de ID inválido!", 400);
    }
        
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError("Usuário não encontrado!", 404);
    }

    return user;
  }

  private async getBudgetOrFail(id: string) {
    if (!isValidObjectId(id)) {
      throw new AppError("Formato de ID inválido!", 400);
    }
        
    const budget = await prisma.budget.findUnique({ where: { id } });

    if (!budget) {
      throw new AppError("Budget não encontrado!", 404);
    }

    return budget;
  }

  async getAll() {
    return prisma.transaction.findMany({
      select: transactionSelect
    });
  }

  async getById(id: string) {
    return this.getTransactionOrFail(id);
  }

  async create(data: CreateTransactionDTO) {
    await this.getUserOrFail(data.userId);
    
    if (data.budgetId) {
      await this.getBudgetOrFail(data.budgetId);
    }

    return prisma.transaction.create({ data });
  }

  async update(id: string, data: Partial<CreateTransactionDTO>) {
    await this.getTransactionOrFail(id);

    if (data.userId) {
      await this.getUserOrFail(data.userId);
    }

    if (data.budgetId) {
      await this.getBudgetOrFail(data.budgetId);
    }

    return prisma.transaction.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.getTransactionOrFail(id);
    return prisma.transaction.delete({ where: { id } });
  }
}

export const transactionService = new TransactionService();