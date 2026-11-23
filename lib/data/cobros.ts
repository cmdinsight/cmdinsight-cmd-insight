// Cobros del plan individual: sincroniza lo que dice dLocal Go con nuestra base.
//
// No confiamos en lo que llega al aviso (webhook) de dLocal: cuando llega,
// volvemos a pedirle a la API de dLocal (con nuestras claves) las suscripciones
// y sus cobros. Así nadie puede activar una cuenta mandando un aviso falso.

import { prisma } from "@/lib/prisma";
import {
  cobrosDeSuscripcion,
  dlocalConfigurado,
  suscripcionesDelPlan,
  urlCheckoutSuscripcion,
} from "@/lib/dlocal";
import { calcularEstado, estadoEsPagado, fechaDe, suscripcionActivaEnDlocal, tieneAcceso } from "@/lib/cobros";

/** No sincronizar más de una vez cada tantos segundos (salvo que se fuerce). */
const SYNC_MIN_SEGUNDOS = 20;

export async function getConfigCobro() {
  return (
    (await prisma.configCobro.findUnique({ where: { id: "default" } })) ??
    (await prisma.configCobro.create({ data: { id: "default" } }))
  );
}

export async function guardarPlan(planId: string, planToken: string) {
  return prisma.configCobro.upsert({
    where: { id: "default" },
    create: { id: "default", dlocalPlanId: planId, dlocalPlanToken: planToken },
    update: { dlocalPlanId: planId, dlocalPlanToken: planToken, ultimoError: null },
  });
}

/** Link para que este deportista pague, o null si el cobro todavía no está configurado. */
export async function linkDePago(email: string): Promise<string | null> {
  if (!dlocalConfigurado()) return null;
  const cfg = await getConfigCobro();
  if (!cfg.dlocalPlanToken) return null;
  return urlCheckoutSuscripcion(cfg.dlocalPlanToken, email);
}

export interface ResultadoSync {
  ok: boolean;
  omitida?: boolean;
  suscripciones: number;
  vinculadas: number;
  sinCuenta: string[];
  error?: string;
}

export async function sincronizarCobros({ forzar = false } = {}): Promise<ResultadoSync> {
  const vacio: ResultadoSync = { ok: false, suscripciones: 0, vinculadas: 0, sinCuenta: [] };
  if (!dlocalConfigurado()) return { ...vacio, error: "Faltan las claves de dLocal en Vercel." };

  const cfg = await getConfigCobro();
  if (!cfg.dlocalPlanId) return { ...vacio, error: "Todavía no hay plan de dLocal configurado." };
  if (!forzar && cfg.ultimaSync && Date.now() - cfg.ultimaSync.getTime() < SYNC_MIN_SEGUNDOS * 1000) {
    return { ...vacio, ok: true, omitida: true };
  }
  await prisma.configCobro.update({ where: { id: "default" }, data: { ultimaSync: new Date() } });

  try {
    const subs = await suscripcionesDelPlan(cfg.dlocalPlanId);
    const sinCuenta: string[] = [];

    // Una persona puede tener varias suscripciones (se dio de baja y volvió).
    // Juntamos todas por organización y nos quedamos con la mejor.
    type Candidata = {
      subId: string;
      email: string;
      activa: boolean;
      estadoDlocal: string | null;
      cobros: { id: string; monto: number | null; moneda: string | null; estado: string; pagado: boolean; fecha: Date }[];
      ultimoPago: Date | null;
    };
    const porOrg = new Map<string, Candidata[]>();

    for (const s of subs) {
      const subId = String(s.id ?? s.subscription_token ?? "");
      const email = String(s.client_email ?? "").toLowerCase().trim();
      if (!subId || !email) continue;

      const usuario = await prisma.usuario.findUnique({
        where: { email },
        select: { deportista: { select: { organizacion: { select: { id: true, tipo: true } } } } },
      });
      const org = usuario?.deportista?.organizacion;
      if (!org || org.tipo !== "INDIVIDUAL") {
        sinCuenta.push(email);
        continue;
      }

      const ejecuciones = await cobrosDeSuscripcion(cfg.dlocalPlanId, subId);
      const cobros = ejecuciones
        .map((e) => {
          const fecha = fechaDe(e) ?? new Date();
          const estado = String(e.status ?? "DESCONOCIDO");
          return {
            id: `${subId}:${e.id ?? e.order_id ?? fecha.toISOString()}`,
            monto: e.amount_paid != null ? Number(e.amount_paid) : e.amount != null ? Number(e.amount) : null,
            moneda: e.currency ?? e.checkout_currency ?? null,
            estado,
            pagado: estadoEsPagado(estado),
            fecha,
          };
        });
      const pagos = cobros.filter((c) => c.pagado).map((c) => c.fecha.getTime());
      const lista = porOrg.get(org.id) ?? [];
      lista.push({
        subId,
        email,
        activa: suscripcionActivaEnDlocal(s),
        estadoDlocal: s.status != null ? String(s.status) : null,
        cobros,
        ultimoPago: pagos.length ? new Date(Math.max(...pagos)) : null,
      });
      porOrg.set(org.id, lista);
    }

    for (const [organizacionId, cands] of porOrg) {
      // La mejor: la activa con el pago más reciente; si no, la de pago más reciente.
      cands.sort(
        (a, b) =>
          Number(b.activa) - Number(a.activa) ||
          (b.ultimoPago?.getTime() ?? 0) - (a.ultimoPago?.getTime() ?? 0),
      );
      const elegida = cands[0];
      const ultimoPagoEn = cands.reduce<Date | null>(
        (m, c) => (c.ultimoPago && (!m || c.ultimoPago > m) ? c.ultimoPago : m),
        null,
      );
      const { estado, pagaHasta } = calcularEstado({ activaEnDlocal: elegida.activa, ultimoPagoEn });

      const datos = {
        dlocalSubscriptionId: elegida.subId,
        email: elegida.email,
        estado,
        estadoDlocal: elegida.estadoDlocal,
        activaEnDlocal: elegida.activa,
        ultimoPagoEn,
        pagaHasta,
      };
      // Si la suscripción elegida estaba guardada en otra org (no debería), la liberamos.
      await prisma.suscripcion.deleteMany({
        where: { dlocalSubscriptionId: elegida.subId, NOT: { organizacionId } },
      });
      const sus = await prisma.suscripcion.upsert({
        where: { organizacionId },
        create: { organizacionId, ...datos },
        update: datos,
      });

      for (const c of cands.flatMap((x) => x.cobros)) {
        await prisma.pago.upsert({
          where: { dlocalId: c.id },
          create: {
            suscripcionId: sus.id,
            dlocalId: c.id,
            monto: c.monto,
            moneda: c.moneda,
            estadoDlocal: c.estado,
            pagado: c.pagado,
            fecha: c.fecha,
          },
          update: { suscripcionId: sus.id, estadoDlocal: c.estado, pagado: c.pagado, monto: c.monto },
        });
      }

      // Con un pago hecho, la organización pasa al Plan Individual pago.
      if (ultimoPagoEn) {
        await prisma.organizacion.update({ where: { id: organizacionId }, data: { plan: "INDIVIDUAL" } });
      }
    }

    await prisma.configCobro.update({ where: { id: "default" }, data: { ultimoError: null } });
    return {
      ok: true,
      suscripciones: subs.length,
      vinculadas: porOrg.size,
      sinCuenta: Array.from(new Set(sinCuenta)),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[cobros] sync falló:", msg);
    await prisma.configCobro.update({ where: { id: "default" }, data: { ultimoError: msg.slice(0, 500) } });
    return { ...vacio, error: msg };
  }
}

/**
 * ¿Hay que frenar al deportista individual por falta de pago?
 * Solo si tiene Plan Individual Y una suscripción de dLocal que ya no cubre hoy.
 * Un Plan Individual asignado a mano por el admin (sin suscripción) no se frena.
 */
export function bloqueadoPorPago(
  org: { tipo: string; plan: string } | null | undefined,
  sus: { estado: string; pagaHasta: Date | null } | null | undefined,
): boolean {
  if (!org || org.tipo !== "INDIVIDUAL" || org.plan !== "INDIVIDUAL" || !sus) return false;
  return !tieneAcceso(sus);
}
