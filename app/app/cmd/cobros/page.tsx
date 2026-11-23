import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DLOCAL_PRODUCCION, dlocalConfigurado } from "@/lib/dlocal";
import { getConfigCobro } from "@/lib/data/cobros";
import { ESTADO_LABEL } from "@/lib/cobros";
import { fmtFecha } from "@/lib/trial";
import { precioUYU } from "@/lib/planes";
import { CobrosAcciones } from "@/components/app/CobrosAcciones";

export const dynamic = "force-dynamic";

const COLOR: Record<string, string> = {
  ACTIVA: "text-teal-deep",
  PENDIENTE: "text-slatey",
  VENCIDA: "text-[#b91c1c]",
  CANCELADA: "text-slatey",
};

export default async function CobrosPage() {
  await requireRole("ADMIN_CMD");

  const [cfg, suscripciones, pagos] = await Promise.all([
    getConfigCobro(),
    prisma.suscripcion.findMany({
      orderBy: { updatedAt: "desc" },
      include: { organizacion: { select: { id: true, nombre: true } } },
    }),
    prisma.pago.findMany({
      orderBy: { fecha: "desc" },
      take: 30,
      include: { suscripcion: { select: { email: true } } },
    }),
  ]);

  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);
  const cobradoMes = pagos
    .filter((p) => p.pagado && p.fecha >= inicioMes)
    .reduce((t, p) => t + (p.monto ?? 0), 0);
  const cuenta = (e: string) => suscripciones.filter((s) => s.estado === e).length;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="font-display text-2xl font-extrabold text-ink">Cobros · Plan Individual</h1>

      <div className="card p-5 text-sm">
        <div className="font-display font-bold text-ink">Conexión con dLocal Go</div>
        <ul className="mt-2 space-y-1 text-slatey">
          <li>
            Claves en Vercel:{" "}
            <b className={dlocalConfigurado() ? "text-teal-deep" : "text-[#b91c1c]"}>
              {dlocalConfigurado() ? "cargadas" : "faltan DLOCAL_API_KEY y DLOCAL_SECRET_KEY"}
            </b>
          </li>
          <li>
            Modo:{" "}
            <b className="text-ink">
              {DLOCAL_PRODUCCION ? "producción (cobros reales)" : "sandbox (pruebas, no cobra)"}
            </b>
          </li>
          <li>
            Plan de suscripción:{" "}
            <b className="text-ink">{cfg.dlocalPlanId ? `n.º ${cfg.dlocalPlanId}` : "sin configurar"}</b>
          </li>
          <li>
            Última sincronización:{" "}
            {cfg.ultimaSync ? cfg.ultimaSync.toLocaleString("es-UY") : "nunca"}
          </li>
          {cfg.ultimoError && (
            <li className="font-medium text-[#b91c1c]">Último error: {cfg.ultimoError}</li>
          )}
        </ul>
        <CobrosAcciones
          claves={dlocalConfigurado()}
          tienePlan={!!cfg.dlocalPlanId}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Al día", cuenta("ACTIVA")],
          ["Pago rechazado", cuenta("VENCIDA")],
          ["Esperando 1.er pago", cuenta("PENDIENTE")],
          ["Cobrado este mes", precioUYU(cobradoMes)],
        ].map(([t, v]) => (
          <div key={t as string} className="card p-4">
            <div className="text-xs text-slatey">{t}</div>
            <div className="font-display text-xl font-extrabold text-ink tabular-nums">{v}</div>
          </div>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <div className="px-4 pt-4 font-display text-sm font-bold text-ink">Suscripciones</div>
        {suscripciones.length === 0 ? (
          <p className="p-4 text-sm text-slatey">Todavía nadie se suscribió.</p>
        ) : (
          <table className="mt-2 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-slatey">
                <th className="px-4 py-2">Deportista</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Último pago</th>
                <th className="px-4 py-2">Acceso hasta</th>
              </tr>
            </thead>
            <tbody>
              {suscripciones.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-2.5">
                    <Link href={`/app/cmd/${s.organizacion.id}`} className="font-semibold text-ink hover:underline">
                      {s.organizacion.nombre}
                    </Link>
                    <div className="text-xs text-slatey">{s.email}</div>
                  </td>
                  <td className={`px-4 py-2.5 font-semibold ${COLOR[s.estado] ?? ""}`}>
                    {ESTADO_LABEL[s.estado] ?? s.estado}
                    {!s.activaEnDlocal && s.estado === "ACTIVA" && (
                      <div className="text-xs font-normal text-slatey">dada de baja</div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-slatey">{s.ultimoPagoEn ? fmtFecha(s.ultimoPagoEn) : "—"}</td>
                  <td className="px-4 py-2.5 text-slatey">{s.pagaHasta ? fmtFecha(s.pagaHasta) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagos.length > 0 && (
        <div className="card overflow-x-auto">
          <div className="px-4 pt-4 font-display text-sm font-bold text-ink">Últimos cobros</div>
          <table className="mt-2 w-full text-left text-sm">
            <tbody>
              {pagos.map((p) => (
                <tr key={p.id} className="border-t border-line">
                  <td className="px-4 py-2 text-slatey">{fmtFecha(p.fecha)}</td>
                  <td className="px-4 py-2 text-ink">{p.suscripcion.email}</td>
                  <td className="px-4 py-2 tabular-nums">{p.monto != null ? precioUYU(p.monto) : "—"}</td>
                  <td className={`px-4 py-2 font-semibold ${p.pagado ? "text-teal-deep" : "text-[#b91c1c]"}`}>
                    {p.pagado ? "Pagado" : p.estadoDlocal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
