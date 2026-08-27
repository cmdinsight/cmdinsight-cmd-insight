import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApi, json, handler, ApiError } from "@/lib/api";
import { resolveOrgId } from "@/lib/data/org";

export const runtime = "nodejs";

export const GET = handler(async (req: NextRequest) => {
  const s = await requireApi("ENTRENADOR", "MEDICO", "ADMIN_ORG", "ADMIN_CMD");
  const orgId = resolveOrgId(s, req.nextUrl.searchParams.get("org"));
  const grupos = await prisma.grupo.findMany({ where: { organizacionId: orgId }, orderBy: { nombre: "asc" } });
  return json({ grupos });
});

export const POST = handler(async (req: NextRequest) => {
  const s = await requireApi("ADMIN_ORG", "ADMIN_CMD");
  const body = await req.json().catch(() => ({}));
  const orgId = resolveOrgId(s, body.organizacionId);
  const nombre = String(body.nombre ?? "").trim();
  if (!nombre) throw new ApiError(400, "El nombre del grupo es obligatorio.");
  const grupo = await prisma.grupo.create({ data: { nombre, organizacionId: orgId } });
  return json({ ok: true, grupo }, 201);
});
