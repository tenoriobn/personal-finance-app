import { prisma } from "@/src/config/prisma";
import AppError from "@/src/utils/appError";
import { ensureUniqueOrFail, getEntityOrFail } from "@/src/utils/dbHelpers";
import { signToken } from "@/src/utils/jwt";
import bcrypt from "bcryptjs";
import { CreateUserDTO } from "../user/user.types";

class AuthService {
  async create(data: CreateUserDTO) {
    await ensureUniqueOrFail(prisma.user, { email: data.email }, "E-mail já está em uso!");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userRole = await prisma.role.findUnique({ where: { name: "USER" } });

    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword, roleId: userRole!.id },
      include: { role: true },
    });

    return { ...user, password: undefined };
  }

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