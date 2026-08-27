import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signSession, COOKIE_NAME } from "@/lib/session";
import { json, handler } from "@/lib/api";

export const runtime = "nodejs";

// Crea el primer usuario ADMIN_CMD. Solo funciona si la base no tiene usuarios.
export const POST = handler(async (req: NextRequest) => {
  const count = await prisma.usuario.count();
  if (count > 0) return json({ error: "La plataforma ya está configurada." }, 403);

  const body = await req.json().catch(() => null);
  const nombre = String(body?.nombre ?? "").trim();
  const email = String(body?.email ?? "").toLowerCase().trim();
  const password = String(body?.password ?? "");
  if (!nombre || !email || password.length < 8) {
    return json({ error: "Nombre, email y contraseña (mínimo 8 caracteres)." }, 400);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.usuario.create({
    data: { nombre, email, passwordHash, rol: "ADMIN_CMD" },
  });

  const token = await signSession({
    sub: user.id,
    email: user.email,
    nombre: user.nombre,
    rol: "ADMIN_CMD",
    orgId: null,
  });
  const res = json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
});
