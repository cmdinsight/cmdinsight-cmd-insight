import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApi, json, handler, ApiError } from "@/lib/api";
import { saveControlSemanal } from "@/lib/data/controles";

export const runtime = "nodejs";

export const POST = handler(async (req: NextRequest) => {
  const s = await requireApi("DEPORTISTA");
  const d = await prisma.deportista.findFirst({
    where: { usuarioId: s.sub },
    include: { organizacion: { select: { tipo: true } } },
  });
  if (!d) throw new ApiError(400, "Tu usuario no está vinculado a un perfil de deportista.");

  const body = await req.json().catch(() => ({}));
  const risk = await saveControlSemanal(d.id, body);
  const mostrarRiesgo = d.organizacion?.tipo === "INDIVIDUAL";
  return json({ ok: true, mostrarRiesgo, risk: mostrarRiesgo ? risk : null });
});
