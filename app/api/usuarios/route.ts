import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApi, json, handler } from "@/lib/api";
import { resolveOrgId, crearUsuario } from "@/lib/data/org";

export const runtime = "nodejs";

export const GET = handler(async (req: NextRequest) => {
  const s = await requireApi("ADMIN_ORG", "ADMIN_CMD");
  const orgId = resolveOrgId(s, req.nextUrl.searchParams.get("org"));
  const usuarios = await prisma.usuario.findMany({
    where: { organizacionId: orgId },
    select: { id: true, nombre: true, email: true, rol: true, activo: true },
    orderBy: { nombre: "asc" },
  });
  return json({ usuarios });
});

export const POST = handler(async (req: NextRequest) => {
  const s = await requireApi("ADMIN_ORG", "ADMIN_CMD");
  const body = await req.json().catch(() => ({}));
  const orgId = resolveOrgId(s, body.organizacionId);
  const u = await crearUsuario(s, orgId, body);
  return json({ ok: true, usuario: { id: u.id, email: u.email } }, 201);
});
