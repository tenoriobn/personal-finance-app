import { prisma } from "src/config/prisma";
import { seedDemoUser } from "./demo.seed";

class DemoResetService {
  async resetUserData(userId: string): Promise<void> {
    await prisma.$transaction(async () => {
      await prisma.transaction.deleteMany({ where: { userId } });

      await prisma.budget.deleteMany({ where: { userId } });

      await prisma.pot.deleteMany({ where: { userId } });

      await seedDemoUser(userId);
    });
  }
}

export const demoResetService = new DemoResetService();
