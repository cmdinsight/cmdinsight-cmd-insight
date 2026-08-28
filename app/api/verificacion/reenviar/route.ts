import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApi, json, handler, ApiError } from "@/lib/api";
import { enviarVerificacionEmail } from "@/lib/data/verificacion";

export const runtime = "nodejs";

// Reenvía el email de verificación al usuario logueado.
export const POST = handler(async (req: NextRequest) => {
  const s = await requireApi();
  const u = await prisma.usuario.findUnique({
    where: { id: s.sub },
    select: { id: true, email: true, nombre: true, emailVerificadoEn: true },
  });
  if (!u) throw new ApiError(404, "Usuario no encontrado.");
  if (u.emailVerificadoEn) return json({ ok: true, yaVerificado: true });

  await enviarVerificacionEmail(u, req.nextUrl.origin);
  return json({ ok: true });
});
