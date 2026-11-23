// Aviso de dLocal Go (notification_url del plan) y tarea diaria de Vercel.
//
// Es público a propósito: no leemos nada del cuerpo del aviso, solo lo usamos
// como "timbre" para volver a consultar la API de dLocal con nuestras claves.
// Un aviso falso no puede activar ninguna cuenta.

import { json } from "@/lib/api";
import { sincronizarCobros } from "@/lib/data/cobros";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function atender() {
  const r = await sincronizarCobros();
  // dLocal reintenta si no recibe 200; respondemos 200 aunque la sync falle
  // (el error queda guardado y se ve en el panel de Cobros).
  return json({ ok: r.ok, omitida: !!r.omitida });
}

export const POST = atender;
export const GET = atender;
