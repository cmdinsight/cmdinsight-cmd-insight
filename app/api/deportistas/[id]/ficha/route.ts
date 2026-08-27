import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApi, json, handler, ApiError } from "@/lib/api";

export const runtime = "nodejs";

type Ctx = { params: { id: string } };

export const PUT = handler(async (req: NextRequest, ctx: Ctx) => {
  const s = await requireApi("MEDICO", "ADMIN_ORG", "ADMIN_CMD");
  const deportistaId = ctx.params.id;

  const d = await prisma.deportista.findUnique({ where: { id: deportistaId } });
  if (!d) throw new ApiError(404, "Deportista no encontrado.");
  if (s.rol !== "ADMIN_CMD" && d.organizacionId !== s.orgId) throw new ApiError(403, "Sin permiso.");

  const b = await req.json().catch(() => ({}));
  const data = {
    antecedentes: b.antecedentes?.toString().trim() || null,
    lesionesPrevias: b.lesionesPrevias?.toString().trim() || null,
    medicacion: b.medicacion?.toString().trim() || null,
    chequeoPrecompFecha: b.chequeoPrecompFecha ? new Date(b.chequeoPrecompFecha) : null,
    ecgInformado: !!b.ecgInformado,
    ecgNotas: b.ecgNotas?.toString().trim() || null,
    actualizadoPor: s.nombre,
  };

  const ficha = await prisma.fichaMedica.upsert({
    where: { deportistaId },
    create: { deportistaId, ...data },
    update: data,
  });
  return json({ ok: true, ficha });
});
