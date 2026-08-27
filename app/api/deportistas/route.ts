import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApi, json, handler } from "@/lib/api";
import { resolveOrgId, crearDeportista } from "@/lib/data/org";

export const runtime = "nodejs";

export const GET = handler(async (req: NextRequest) => {
  const s = await requireApi("ENTRENADOR", "MEDICO", "ADMIN_ORG", "ADMIN_CMD");
  const orgId = resolveOrgId(s, req.nextUrl.searchParams.get("org"));
  const deportistas = await prisma.deportista.findMany({
    where: { organizacionId: orgId },
    include: { grupo: true, usuario: { select: { email: true } } },
    orderBy: { nombre: "asc" },
  });
  return json({ deportistas });
});

export const POST = handler(async (req: NextRequest) => {
  const s = await requireApi("ADMIN_ORG", "ADMIN_CMD");
  const body = await req.json().catch(() => ({}));
  const orgId = resolveOrgId(s, body.organizacionId);
  const d = await crearDeportista(orgId, body);
  return json({ ok: true, deportista: d }, 201);
});
