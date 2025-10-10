import { prisma } from "@/src/config/prisma";
import AppError from "@/src/utils/appError";
import { getEntityOrFail } from "@/src/utils/dbHelpers";
import { signToken } from "@/src/utils/jwt";
import bcrypt from "bcryptjs";

class AuthService {
  async login(email: string, password: string) {
    const user = await getEntityOrFail(prisma.user, { email }, "Usuário não encontrado!");

    if (!user){ 
      throw new AppError("Credenciais inválidas", 401);
    };

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const role = await getEntityOrFail(prisma.role, { id: user.roleId }, "Role não encontrado durante Autenticação!");

    const payload = { id: user.id, role: role.name, };
    const token = signToken(payload);

    return { token, user: { id: user.id, email: user.email, role: user.roleId} };
  }
}

export const authService = new AuthService();