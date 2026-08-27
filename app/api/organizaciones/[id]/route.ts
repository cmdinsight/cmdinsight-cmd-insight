import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApi, json, handler } from "@/lib/api";

export const runtime = "nodejs";

const PLANES = new Set([
  "TRIAL",
  "CORTESIA_CMD",
  "CLUB_MENSUAL",
  "GIMNASIO",
  "INDIVIDUAL",
  "INDIVIDUAL_PREMIUM",
]);

export const PATCH = handler(async (req: NextRequest, ctx: { params: { id: string } }) => {
  await requireApi("ADMIN_CMD");
  const b = await req.json().catch(() => ({}));

  const org = await prisma.organizacion.update({
    where: { id: ctx.params.id },
    data: {
      ...(b.nombre != null ? { nombre: String(b.nombre).trim() } : {}),
      ...(b.plan && PLANES.has(b.plan) ? { plan: b.plan as never } : {}),
      ...(b.cmdCubierta !== undefined ? { cmdCubierta: !!b.cmdCubierta } : {}),
      ...(b.trialHasta !== undefined
        ? { trialHasta: b.trialHasta ? new Date(b.trialHasta) : null }
        : {}),
      ...(b.notas !== undefined ? { notas: b.notas?.toString().trim() || null } : {}),
    },
  });
  return json({ ok: true, organizacion: org });
});
