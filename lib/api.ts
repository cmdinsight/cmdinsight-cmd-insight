// Helpers para route handlers (app/api/**).

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME, verifySession, type SessionPayload } from "./session";
import type { Rol } from "./roles";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export async function apiSession(): Promise<SessionPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** Devuelve la sesión o lanza ApiError 401 / 403. */
export async function requireApi(...roles: Rol[]): Promise<SessionPayload> {
  const s = await apiSession();
  if (!s) throw new ApiError(401, "No autenticado");
  if (roles.length > 0 && !roles.includes(s.rol)) throw new ApiError(403, "Sin permiso");
  return s;
}

/** Envuelve un handler y traduce ApiError / errores a respuestas JSON. */
export function handler<T extends unknown[]>(
  fn: (...args: T) => Promise<NextResponse> | NextResponse,
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await fn(...args);
    } catch (e) {
      if (e instanceof ApiError) return json({ error: e.message }, e.status);
      console.error(e);
      return json({ error: "Error interno" }, 500);
    }
  };
}
