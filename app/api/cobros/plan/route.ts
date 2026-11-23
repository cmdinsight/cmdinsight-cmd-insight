import type { NextRequest } from "next/server";
import { ApiError, handler, json, requireApi } from "@/lib/api";
import { crearPlan, DlocalError, dlocalConfigurado, obtenerPlan } from "@/lib/dlocal";
import { guardarPlan } from "@/lib/data/cobros";
import { PRECIO_MENSUAL_UYU } from "@/lib/planes";

export const runtime = "nodejs";

// Configura el plan de suscripción de dLocal Go que se usa para el Plan Individual.
//   { modo: "crear" }               → lo crea en dLocal con el precio de lib/planes.ts
//   { planId: "123" }               → usa un plan ya creado en el panel de dLocal Go
export const POST = handler(async (req: NextRequest) => {
  await requireApi("ADMIN_CMD");
  if (!dlocalConfigurado()) throw new ApiError(400, "Primero cargá DLOCAL_API_KEY y DLOCAL_SECRET_KEY en Vercel.");
  const b = await req.json().catch(() => ({}));
  const origen = new URL(req.url).origin;

  try {
    let plan;
    if (b.modo === "crear") {
      plan = await crearPlan({
        nombre: "CMD Insight - Plan Individual",
        descripcion: "Control de carga y riesgo de lesión. Suscripción mensual.",
        montoUYU: PRECIO_MENSUAL_UYU.INDIVIDUAL,
        urlNotificacion: `${origen}/api/dlocal/notificacion`,
        urlExito: `${origen}/app/mi/suscripcion?pago=ok`,
        urlVolver: `${origen}/app/mi/suscripcion`,
        urlError: `${origen}/app/mi/suscripcion?pago=error`,
      });
    } else if (b.planId) {
      plan = await obtenerPlan(String(b.planId).trim());
    } else {
      throw new ApiError(400, "Falta el número de plan.");
    }
    if (!plan?.id || !plan.plan_token) {
      throw new ApiError(502, "dLocal no devolvió el número o el token del plan: " + JSON.stringify(plan).slice(0, 300));
    }
    await guardarPlan(String(plan.id), String(plan.plan_token));
    return json({ ok: true, planId: String(plan.id), nombre: plan.name, monto: plan.amount });
  } catch (e) {
    if (e instanceof DlocalError) throw new ApiError(502, e.message);
    throw e;
  }
});
