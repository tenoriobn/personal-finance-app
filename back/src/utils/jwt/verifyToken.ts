import jwt from "jsonwebtoken";
import { JwtPayload } from "./jwt.type";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { iat: number; exp: number };

    if (!decoded.role) {
      throw new Error("Token inválido: role ausente");
    };

    return { id: decoded.id, role: decoded.role };
  } catch {
    throw new Error("Token inválido ou expirado");
  }
}