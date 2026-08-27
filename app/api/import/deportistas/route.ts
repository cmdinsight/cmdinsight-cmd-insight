import type { NextRequest } from "next/server";
import { requireApi, json, handler } from "@/lib/api";
import { resolveOrgId, importarDeportistas } from "@/lib/data/org";

export const runtime = "nodejs";

export const POST = handler(async (req: NextRequest) => {
  const s = await requireApi("ADMIN_ORG", "ADMIN_CMD");
  const body = await req.json().catch(() => ({}));
  const orgId = resolveOrgId(s, body.organizacionId);
  const result = await importarDeportistas(orgId, String(body.csv ?? ""));
  return json({ ok: true, ...result });
});
