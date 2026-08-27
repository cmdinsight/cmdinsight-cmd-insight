import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApi, json, handler, ApiError } from "@/lib/api";
import { saveEvento } from "@/lib/data/controles";

export const runtime = "nodejs";

const STAFF = new Set(["ENTRENADOR", "MEDICO", "ADMIN_ORG", "ADMIN_CMD"]);

export const POST = handler(async (req: NextRequest) => {
  const s = await requireApi();
  const body = await req.json().catch(() => ({}));

  let deportistaId: string;
  let registradoPor: string | null = null;

  if (body.deportistaId && STAFF.has(s.rol)) {
    const d = await prisma.deportista.findUnique({ where: { id: String(body.deportistaId) } });
    if (!d) throw new ApiError(404, "Deportista no encontrado.");
    if (s.rol !== "ADMIN_CMD" && d.organizacionId !== s.orgId) throw new ApiError(403, "Sin permiso.");
    deportistaId = d.id;
    registradoPor = s.nombre;
  } else {
    const d = await prisma.deportista.findFirst({ where: { usuarioId: s.sub } });
    if (!d) throw new ApiError(400, "Tu usuario no está vinculado a un perfil de deportista.");
    deportistaId = d.id;
  }

  const risk = await saveEvento(deportistaId, { ...body, registradoPor });
  return json({ ok: true, risk });
});
