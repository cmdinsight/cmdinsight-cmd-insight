import { NextResponse } from "next/server";
import { requireApi, handler, json } from "@/lib/api";
import { linkDePago } from "@/lib/data/cobros";

export const runtime = "nodejs";

// Lleva al deportista al checkout de dLocal Go con su email ya cargado
// (así su pago queda vinculado a su cuenta).
export const GET = handler(async () => {
  const s = await requireApi("DEPORTISTA");
  const url = await linkDePago(s.email);
  if (!url) return json({ error: "El pago online todavía no está disponible." }, 503);
  return NextResponse.redirect(url, 303);
});
