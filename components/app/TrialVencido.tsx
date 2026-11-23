import { CONTACTO } from "@/lib/legal";
import { fmtFecha } from "@/lib/trial";
import { PRECIO_MENSUAL_UYU, precioUYU } from "@/lib/planes";

/** Pantalla que ve el deportista individual cuando su prueba de 30 días terminó. */
export function TrialVencido({
  venceEl,
  linkPago,
}: {
  venceEl: Date | null;
  /** Si el pago online está configurado, se ofrece pagar directo con dLocal. */
  linkPago?: string | null;
}) {
  return (
    <div className="mx-auto max-w-lg">
      <div className="card p-7 text-center">
        <div className="font-display text-2xl font-extrabold text-ink">
          Tu prueba de 30 días terminó
        </div>
        <p className="mt-3 text-sm text-slatey">
          {venceEl ? <>Venció el {fmtFecha(venceEl)}. </> : null}
          Tus datos están guardados.{" "}
          {linkPago
            ? <>Para seguir usando tu control de carga y riesgo, activá el Plan Individual por {precioUYU(PRECIO_MENSUAL_UYU.INDIVIDUAL)} al mes. Lo podés dar de baja cuando quieras.</>
            : <>Para seguir usando tu control de carga y riesgo, escribinos y activamos tu cuenta.</>}
        </p>
        {linkPago ? (
          <>
            <a href="/api/cobros/pagar" className="btn btn-accent mt-6 w-full">
              Pagar {precioUYU(PRECIO_MENSUAL_UYU.INDIVIDUAL)} por mes
            </a>
            <p className="mt-2 text-xs text-slatey">
              El pago lo procesa dLocal Go (tarjeta y medios de pago de Uruguay). Al terminar volvés
              acá y tu cuenta se activa sola.
            </p>
            <a href={CONTACTO.whatsappLink} className="btn btn-ghost mt-4 w-full">
              Tengo una duda: escribir por WhatsApp
            </a>
          </>
        ) : (
          <a href={CONTACTO.whatsappLink} className="btn btn-accent mt-6 w-full">
            Escribir por WhatsApp
          </a>
        )}
        <p className="mt-3 text-xs text-slatey">
          O por email a{" "}
          <a href={`mailto:${CONTACTO.email}`} className="underline">
            {CONTACTO.email}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
