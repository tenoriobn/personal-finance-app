import { prisma } from "@/src/config/prisma";
import AppError from "@/src/utils/appError";
import { getEntityOrFail } from "@/src/utils/dbHelpers";
import { signToken } from "@/src/utils/jwt";
import bcrypt from "bcryptjs";

class AuthService {
  async login(email: string, password: string) {
    const user = await getEntityOrFail(prisma.user, { email }, "Usuário não encontrado!");

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const payload = { id: user.id, role: user.role };
    const token = signToken(payload);

    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }
}

export const authService = new AuthService();