import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, handler, ApiError } from "@/lib/api";

export const runtime = "nodejs";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const POST = handler(async (req: NextRequest) => {
  const b = await req.json().catch(() => ({}));

  // Honeypot: si un bot completa este campo oculto, se descarta en silencio.
  if (typeof b.website === "string" && b.website.trim() !== "") {
    return json({ ok: true });
  }

  const nombre = String(b.nombre ?? "").trim();
  const email = String(b.email ?? "").trim().toLowerCase();
  const mensaje = String(b.mensaje ?? "").trim();
  const origen = String(b.origen ?? "web").slice(0, 80);

  if (!nombre || nombre.length > 120) throw new ApiError(400, "Ingresá tu nombre.");
  if (!EMAIL_RE.test(email) || email.length > 160) throw new ApiError(400, "Ingresá un email válido.");
  if (mensaje.length < 5 || mensaje.length > 4000) throw new ApiError(400, "Escribí un mensaje (mínimo 5 caracteres).");

  await prisma.contactoMensaje.create({ data: { nombre, email, mensaje, origen } });
  return json({ ok: true });
});
