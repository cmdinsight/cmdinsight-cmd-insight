// Reglas del cobro del plan individual (funciones puras, sin base ni red).

/** Días extra de acceso después de que vence el mes pagado (por si el cobro se atrasa). */
export const DIAS_GRACIA = 5;

/**
 * ¿Este estado de dLocal significa que la plata entró?
 * dLocal Go no documenta públicamente la lista exacta; aceptamos las variantes
 * habituales y todo lo demás cuenta como no pagado (rechazado, pendiente…).
 */
export function estadoEsPagado(estado: unknown): boolean {
  const s = String(estado ?? "").toUpperCase();
  return ["PAID", "APPROVED", "COMPLETED", "SUCCESS", "CONFIRMED"].includes(s);
}

/** ¿La suscripción sigue activa en dLocal (no la canceló el deportista ni nosotros)? */
export function suscripcionActivaEnDlocal(sub: { active?: unknown; status?: unknown }): boolean {
  if (sub.active === false) return false;
  const s = String(sub.status ?? "").toUpperCase();
  return !["CANCELLED", "CANCELED", "INACTIVE", "DEACTIVATED", "EXPIRED"].includes(s);
}

/** Sumar un mes calendario (31/01 + 1 mes = 28 o 29/02). */
export function sumarUnMes(d: Date): Date {
  const r = new Date(d);
  const dia = r.getUTCDate();
  r.setUTCDate(1);
  r.setUTCMonth(r.getUTCMonth() + 1);
  const ultimo = new Date(Date.UTC(r.getUTCFullYear(), r.getUTCMonth() + 1, 0)).getUTCDate();
  r.setUTCDate(Math.min(dia, ultimo));
  return r;
}

/** Hasta cuándo tiene acceso alguien cuyo último pago fue en `ultimoPago`. */
export function accesoHasta(ultimoPago: Date): Date {
  const r = sumarUnMes(ultimoPago);
  r.setUTCDate(r.getUTCDate() + DIAS_GRACIA);
  return r;
}

export type EstadoSuscripcion = "ACTIVA" | "PENDIENTE" | "VENCIDA" | "CANCELADA";

/**
 * Estado nuestro a partir de lo que dice dLocal:
 * - ACTIVA: pagó y está dentro del mes pagado (+ gracia).
 * - PENDIENTE: se suscribió pero todavía no entró ningún pago.
 * - VENCIDA: sigue suscripta pero el último pago no cubre hoy (cobro rechazado).
 * - CANCELADA: dio de baja la suscripción y ya pasó lo que tenía pago.
 */
export function calcularEstado(params: {
  activaEnDlocal: boolean;
  ultimoPagoEn: Date | null;
  ahora?: Date;
}): { estado: EstadoSuscripcion; pagaHasta: Date | null } {
  const ahora = params.ahora ?? new Date();
  const pagaHasta = params.ultimoPagoEn ? accesoHasta(params.ultimoPagoEn) : null;
  const cubierto = !!pagaHasta && pagaHasta.getTime() > ahora.getTime();

  if (cubierto) return { estado: "ACTIVA", pagaHasta };
  if (!params.activaEnDlocal) return { estado: "CANCELADA", pagaHasta };
  if (!params.ultimoPagoEn) return { estado: "PENDIENTE", pagaHasta };
  return { estado: "VENCIDA", pagaHasta };
}

/** ¿Con este estado el deportista puede usar la plataforma? */
export function tieneAcceso(s: { estado: string; pagaHasta: Date | null } | null | undefined, ahora = new Date()): boolean {
  if (!s) return false;
  return !!s.pagaHasta && s.pagaHasta.getTime() > ahora.getTime();
}

export const ESTADO_LABEL: Record<string, string> = {
  ACTIVA: "Al día",
  PENDIENTE: "Esperando el primer pago",
  VENCIDA: "Pago rechazado o atrasado",
  CANCELADA: "Dada de baja",
};

/** Primer campo con fecha válida de un objeto de dLocal. */
export function fechaDe(obj: any, campos = ["approved_date", "updated_at", "created_at", "created_date"]): Date | null {
  for (const c of campos) {
    const v = obj?.[c];
    if (v) {
      const d = new Date(v);
      if (!isNaN(d.getTime())) return d;
    }
  }
  return null;
}
