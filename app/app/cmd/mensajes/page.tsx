import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MensajesPage() {
  await requireRole("ADMIN_CMD");
  const mensajes = await prisma.contactoMensaje.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/app/cmd" className="text-sm text-slatey hover:underline">← Organizaciones</Link>
      <h1 className="mt-3 font-display text-2xl font-extrabold text-ink">
        Mensajes de contacto ({mensajes.length})
      </h1>
      <p className="mt-1 text-sm text-slatey">
        Enviados desde el formulario público del sitio.
      </p>

      {mensajes.length === 0 ? (
        <div className="card mt-6 p-8 text-sm text-slatey">Todavía no hay mensajes.</div>
      ) : (
        <ul className="mt-6 space-y-3">
          {mensajes.map((m) => (
            <li key={m.id} className="card p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="font-semibold text-ink">{m.nombre}</div>
                <div className="text-xs text-slatey">
                  {new Date(m.createdAt).toLocaleString("es-UY")}
                </div>
              </div>
              <a href={`mailto:${m.email}`} className="text-sm text-navy hover:underline">
                {m.email}
              </a>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slatey">{m.mensaje}</p>
              {m.origen && <div className="mt-2 text-xs text-slatey">Origen: {m.origen}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
