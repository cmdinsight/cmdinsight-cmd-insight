import { handler, json, requireApi } from "@/lib/api";
import { sincronizarCobros } from "@/lib/data/cobros";

export const runtime = "nodejs";

// Botón "Sincronizar ahora" del panel de Cobros (admin CMD).
export const POST = handler(async () => {
  await requireApi("ADMIN_CMD");
  const r = await sincronizarCobros({ forzar: true });
  if (!r.ok) return json({ error: r.error || "No se pudo sincronizar." }, 502);
  return json(r);
});
