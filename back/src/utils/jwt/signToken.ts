import jwt from "jsonwebtoken";
import { JwtPayload } from "./jwt.type";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const EXPIRES_IN = "7d";

export function signToken(payload: JwtPayload): string {
  return jwt.sign({ id: payload.id, role: payload.role }, JWT_SECRET, { expiresIn: EXPIRES_IN });
}