import { ApiError, handler, json, requireApi } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { cancelarSuscripcion, DlocalError } from "@/lib/dlocal";
import { getConfigCobro, sincronizarCobros } from "@/lib/data/cobros";

export const runtime = "nodejs";

// El deportista da de baja su suscripción. Sigue usando la plataforma hasta
// que termine el mes que ya pagó.
export const POST = handler(async () => {
  const s = await requireApi("DEPORTISTA");
  if (!s.orgId) throw new ApiError(400, "Tu cuenta no tiene suscripción.");
  const [sus, cfg] = await Promise.all([
    prisma.suscripcion.findUnique({ where: { organizacionId: s.orgId } }),
    getConfigCobro(),
  ]);
  if (!sus || !cfg.dlocalPlanId) throw new ApiError(404, "No encontramos tu suscripción.");
  try {
    await cancelarSuscripcion(cfg.dlocalPlanId, sus.dlocalSubscriptionId);
  } catch (e) {
    if (e instanceof DlocalError) throw new ApiError(502, "dLocal no pudo darla de baja. Escribinos y lo hacemos nosotros.");
    throw e;
  }
  await prisma.suscripcion.update({ where: { id: sus.id }, data: { activaEnDlocal: false } });
  await sincronizarCobros({ forzar: true });
  return json({ ok: true });
});
