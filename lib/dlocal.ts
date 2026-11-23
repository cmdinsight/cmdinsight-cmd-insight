// Cliente mínimo de la API de dLocal Go (https://dlocalgo.com), sin dependencias.
//
// Las claves viven solo en variables de entorno de Vercel, nunca en el repo:
//   DLOCAL_API_KEY, DLOCAL_SECRET_KEY  → credenciales de la cuenta de dLocal Go
//   DLOCAL_ENV = "production"          → usa la API real; cualquier otro valor
//                                         (o vacío) usa el sandbox de pruebas.
//
// Rutas y autenticación tomadas del cliente de referencia
// github.com/MetaLabs-inc/dlocal_go (la doc oficial no estaba accesible).
// Si dLocal responde con un formato distinto al esperado, los errores se
// muestran tal cual en el panel de Cobros para poder diagnosticar.

export const DLOCAL_PRODUCCION = process.env.DLOCAL_ENV === "production";

const API_BASE = DLOCAL_PRODUCCION ? "https://api.dlocalgo.com" : "https://api-sbx.dlocalgo.com";
const CHECKOUT_SUSCRIPCION = DLOCAL_PRODUCCION
  ? "https://checkout.dlocalgo.com/validate/subscription"
  : "https://checkout-sbx.dlocalgo.com/validate/subscription";

export function dlocalConfigurado(): boolean {
  return !!process.env.DLOCAL_API_KEY && !!process.env.DLOCAL_SECRET_KEY;
}

export class DlocalError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function llamar<T = any>(metodo: "GET" | "POST" | "PATCH", ruta: string, body?: unknown): Promise<T> {
  if (!dlocalConfigurado()) {
    throw new DlocalError(0, "Faltan DLOCAL_API_KEY y DLOCAL_SECRET_KEY en Vercel.");
  }
  const res = await fetch(API_BASE + ruta, {
    method: metodo,
    headers: {
      Authorization: `Bearer ${process.env.DLOCAL_API_KEY}:${process.env.DLOCAL_SECRET_KEY}`,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const texto = await res.text();
  let data: any = null;
  try {
    data = texto ? JSON.parse(texto) : null;
  } catch {
    data = { raw: texto };
  }
  if (!res.ok) {
    const msg = data?.message || data?.error || texto || res.statusText;
    throw new DlocalError(res.status, `dLocal ${res.status}: ${String(msg).slice(0, 300)}`);
  }
  return data as T;
}

/** Las listas de dLocal Go vienen como `{ data: [...] }`; por las dudas aceptamos un array directo. */
export function comoLista(r: any): any[] {
  if (Array.isArray(r)) return r;
  if (Array.isArray(r?.data)) return r.data;
  return [];
}

export interface PlanDlocal {
  id: number | string;
  plan_token?: string;
  name?: string;
  amount?: number;
  currency?: string;
  active?: boolean;
}

export function crearPlan(params: {
  nombre: string;
  descripcion: string;
  montoUYU: number;
  urlNotificacion: string;
  urlExito: string;
  urlVolver: string;
  urlError: string;
}): Promise<PlanDlocal> {
  return llamar<PlanDlocal>("POST", "/v1/subscription/plan", {
    name: params.nombre,
    description: params.descripcion,
    country: "UY",
    currency: "UYU",
    amount: params.montoUYU,
    frequency_type: "MONTHLY",
    frequency_value: 1,
    notification_url: params.urlNotificacion,
    success_url: params.urlExito,
    back_url: params.urlVolver,
    error_url: params.urlError,
  });
}

export function obtenerPlan(planId: string): Promise<PlanDlocal> {
  return llamar<PlanDlocal>("GET", `/v1/subscription/plan/${encodeURIComponent(planId)}`);
}

export async function suscripcionesDelPlan(planId: string): Promise<any[]> {
  return comoLista(await llamar("GET", `/v1/subscription/plan/${encodeURIComponent(planId)}/subscription/all`));
}

export async function cobrosDeSuscripcion(planId: string, subId: string): Promise<any[]> {
  return comoLista(
    await llamar(
      "GET",
      `/v1/subscription/plan/${encodeURIComponent(planId)}/subscription/${encodeURIComponent(subId)}/execution/all`,
    ),
  );
}

export function cancelarSuscripcion(planId: string, subId: string) {
  return llamar(
    "PATCH",
    `/v1/subscription/plan/${encodeURIComponent(planId)}/subscription/${encodeURIComponent(subId)}/deactivate`,
  );
}

/** Link de pago de la suscripción, con el email del deportista ya cargado. */
export function urlCheckoutSuscripcion(planToken: string, email: string): string {
  return `${CHECKOUT_SUSCRIPCION}/${encodeURIComponent(planToken)}?email=${encodeURIComponent(email)}`;
}
