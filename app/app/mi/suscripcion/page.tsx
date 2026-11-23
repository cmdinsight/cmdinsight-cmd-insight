import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { linkDePago, sincronizarCobros } from "@/lib/data/cobros";
import { ESTADO_LABEL } from "@/lib/cobros";
import { fmtFecha, trialInfo } from "@/lib/trial";
import { PLAN_LABEL, PRECIO_MENSUAL_UYU, precioUYU } from "@/lib/planes";
import { CancelarSuscripcion } from "@/components/app/CancelarSuscripcion";

export const dynamic = "force-dynamic";

export default async function MiSuscripcionPage({
  searchParams,
}: {
  searchParams: { pago?: string };
}) {
  const session = await requireRole("DEPORTISTA");

  // Vuelve del checkout de dLocal: traemos el estado nuevo sin esperar el aviso.
  if (searchParams.pago === "ok") await sincronizarCobros();

  const org = session.orgId
    ? await prisma.organizacion.findUnique({
        where: { id: session.orgId },
        include: {
          suscripcion: { include: { pagos: { orderBy: { fecha: "desc" }, take: 12 } } },
        },
      })
    : null;

  if (!org || org.tipo !== "INDIVIDUAL") {
    return (
      <div className="mx-auto max-w-lg card p-6 text-sm text-slatey">
        Tu cuenta la paga tu club o gimnasio. No tenés que hacer nada.
      </div>
    );
  }

  const sus = org.suscripcion;
  const trial = trialInfo(org);
  const link = await linkDePago(session.email);
  const precio = precioUYU(PRECIO_MENSUAL_UYU.INDIVIDUAL);
  const puedePagar = !!link && (!sus || sus.estado !== "ACTIVA" || !sus.activaEnDlocal);

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <h1 className="font-display text-2xl font-extrabold text-ink">Mi suscripción</h1>

      {searchParams.pago === "ok" && sus?.estado !== "ACTIVA" && (
        <div className="card p-4 text-sm text-slatey">
          Recibimos tu pago y estamos esperando la confirmación de dLocal. Puede tardar unos minutos:
          volvé a entrar en un rato.
        </div>
      )}
      {searchParams.pago === "error" && (
        <div className="card p-4 text-sm font-medium text-[#b91c1c]">
          El pago no se pudo completar. Podés intentar de nuevo con otra tarjeta o medio de pago.
        </div>
      )}

      <div className="card p-6">
        <div className="text-sm text-slatey">Plan</div>
        <div className="font-display text-xl font-bold text-ink">
          {PLAN_LABEL[org.plan] ?? org.plan}
          {org.plan === "INDIVIDUAL" && <span className="text-slatey"> · {precio} por mes</span>}
        </div>

        {sus ? (
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-slatey">Estado</dt>
              <dd className="font-semibold text-ink">
                {ESTADO_LABEL[sus.estado] ?? sus.estado}
                {sus.estado === "ACTIVA" && !sus.activaEnDlocal && " (dada de baja)"}
              </dd>
            </div>
            <div>
              <dt className="text-slatey">
                {sus.activaEnDlocal ? "Próximo cobro aprox." : "Acceso hasta"}
              </dt>
              <dd className="font-semibold text-ink">
                {sus.pagaHasta ? fmtFecha(sus.pagaHasta) : "—"}
              </dd>
            </div>
          </dl>
        ) : org.plan === "TRIAL" && trial.venceEl ? (
          <p className="mt-3 text-sm text-slatey">
            Estás en la prueba gratis hasta el {fmtFecha(trial.venceEl)}. Podés activar el plan
            ahora o cuando termine.
          </p>
        ) : null}

        {puedePagar && (
          <a href="/api/cobros/pagar" className="btn btn-accent mt-6 w-full">
            {sus ? "Volver a suscribirme" : "Activar Plan Individual"} · {precio} por mes
          </a>
        )}
        {!link && !sus && (
          <p className="mt-4 text-sm text-slatey">
            El pago online se habilita en los próximos días. Si querés activar ya, escribinos.
          </p>
        )}
        {sus && sus.activaEnDlocal && <CancelarSuscripcion />}
      </div>

      {sus && sus.pagos.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 pt-4 font-display text-sm font-bold text-ink">Últimos cobros</div>
          <table className="mt-2 w-full text-left text-sm">
            <tbody>
              {sus.pagos.map((p) => (
                <tr key={p.id} className="border-t border-line">
                  <td className="px-5 py-2.5 text-slatey">{fmtFecha(p.fecha)}</td>
                  <td className="px-5 py-2.5 text-ink">
                    {p.monto != null ? precioUYU(p.monto) : "—"}
                  </td>
                  <td className={`px-5 py-2.5 font-semibold ${p.pagado ? "text-teal-deep" : "text-[#b91c1c]"}`}>
                    {p.pagado ? "Pagado" : "No cobrado"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-slatey">
        Los pagos los procesa dLocal Go. CMD Insight no guarda los datos de tu tarjeta.
      </p>
    </div>
  );
}
