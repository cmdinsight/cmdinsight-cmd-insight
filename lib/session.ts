import { SignJWT, jwtVerify } from "jose";
import type { Rol } from "./roles";

export const COOKIE_NAME = "cmdinsight_session";

const secret = () =>
  new TextEncoder().encode(
    process.env.AUTH_SECRET || "cmd-insight-dev-secret-cambiar-en-produccion",
  );

export interface SessionPayload {
  sub: string;
  email: string;
  nombre: string;
  rol: Rol;
  orgId: string | null;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
