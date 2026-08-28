import type { NextRequest } from "next/server";
import { signSession, COOKIE_NAME } from "@/lib/session";
import { json, handler, ApiError } from "@/lib/api";
import { crearCuentaIndividual } from "@/lib/data/registro";
import { enviarVerificacionEmail } from "@/lib/data/verificacion";

export const runtime = "nodejs";

// Alta pública self-serve del plan individual. Crea org INDIVIDUAL + usuario
// DEPORTISTA + ficha de deportista, y abre sesión.
export const POST = handler(async (req: NextRequest) => {
  const body = await req.json().catch(() => ({}));

  // Honeypot: si el campo oculto viene lleno, es un bot.
  if (typeof body?.website === "string" && body.website.trim() !== "") {
    throw new ApiError(400, "Solicitud inválida.");
  }

  const usuario = await crearCuentaIndividual(body);

  // Email de verificación (no bloquea el alta si el proveedor no está configurado).
  try {
    await enviarVerificacionEmail(usuario, req.nextUrl.origin);
  } catch (e) {
    console.error("[registro] no se pudo enviar la verificación:", e);
  }

  const token = await signSession({
    sub: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    rol: "DEPORTISTA",
    orgId: usuario.organizacionId,
  });

  const res = json({ ok: true }, 201);
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
});
