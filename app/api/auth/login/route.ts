import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signSession, COOKIE_NAME } from "@/lib/session";
import type { Rol } from "@/lib/roles";
import { json, handler } from "@/lib/api";

export const runtime = "nodejs";

export const POST = handler(async (req: NextRequest) => {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").toLowerCase().trim();
  const password = String(body?.password ?? "");
  if (!email || !password) return json({ error: "Ingresá email y contraseña." }, 400);

  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user || !user.activo || !(await bcrypt.compare(password, user.passwordHash))) {
    return json({ error: "Email o contraseña incorrectos." }, 401);
  }

  const token = await signSession({
    sub: user.id,
    email: user.email,
    nombre: user.nombre,
    rol: user.rol as Rol,
    orgId: user.organizacionId,
  });

  const res = json({ ok: true, rol: user.rol });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
});
