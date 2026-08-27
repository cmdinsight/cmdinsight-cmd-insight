import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApi, json, handler } from "@/lib/api";
import { resolveOrgId, assertDeportistaEnOrg, actualizarDeportista } from "@/lib/data/org";

export const runtime = "nodejs";

type Ctx = { params: { id: string } };

export const PATCH = handler(async (req: NextRequest, ctx: Ctx) => {
  const s = await requireApi("ADMIN_ORG", "ADMIN_CMD");
  const body = await req.json().catch(() => ({}));
  const orgId = resolveOrgId(s, body.organizacionId ?? req.nextUrl.searchParams.get("org"));
  await assertDeportistaEnOrg(ctx.params.id, orgId, s.rol === "ADMIN_CMD");
  const d = await actualizarDeportista(ctx.params.id, body);
  return json({ ok: true, deportista: d });
});

export const DELETE = handler(async (req: NextRequest, ctx: Ctx) => {
  const s = await requireApi("ADMIN_ORG", "ADMIN_CMD");
  const orgId = resolveOrgId(s, req.nextUrl.searchParams.get("org"));
  await assertDeportistaEnOrg(ctx.params.id, orgId, s.rol === "ADMIN_CMD");
  // baja lógica
  await prisma.deportista.update({ where: { id: ctx.params.id }, data: { activo: false } });
  return json({ ok: true });
});
