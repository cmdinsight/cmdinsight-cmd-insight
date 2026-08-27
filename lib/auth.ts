import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifySession, type SessionPayload } from "./session";
import type { Rol } from "./roles";

export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

/** Server component: redirige a /acceder si no hay sesión. */
export async function requireSession(): Promise<SessionPayload> {
  const s = await getSession();
  if (!s) redirect("/acceder");
  return s;
}

/** Server component: redirige a /app si el rol no está permitido. */
export async function requireRole(...roles: Rol[]): Promise<SessionPayload> {
  const s = await requireSession();
  if (!roles.includes(s.rol)) redirect("/app");
  return s;
}
