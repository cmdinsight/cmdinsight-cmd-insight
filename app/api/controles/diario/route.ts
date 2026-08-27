import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApi, json, handler, ApiError } from "@/lib/api";
import { saveControlDiario } from "@/lib/data/controles";

export const runtime = "nodejs";

export const POST = handler(async (req: NextRequest) => {
  const s = await requireApi("DEPORTISTA");
  const d = await prisma.deportista.findFirst({ where: { usuarioId: s.sub } });
  if (!d) throw new ApiError(400, "Tu usuario no está vinculado a un perfil de deportista.");

  const body = await req.json().catch(() => ({}));
  const risk = await saveControlDiario(d.id, body);
  return json({ ok: true, risk });
});
