import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const EXPIRES_IN = "7d";

export interface JwtPayload {
  id: string;
  role: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign({ id: payload.id, role: payload.role }, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

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