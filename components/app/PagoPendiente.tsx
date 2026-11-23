import { CONTACTO } from "@/lib/legal";
import { PRECIO_MENSUAL_UYU, precioUYU } from "@/lib/planes";

/**
 * Pantalla del deportista con Plan Individual cuando su cobro mensual no entró
 * (tarjeta rechazada) o se dio de baja y terminó el mes que había pagado.
 */
export function PagoPendiente({ estado, linkPago }: { estado: string; linkPago?: string | null }) {
  const cancelada = estado === "CANCELADA";
  return (
    <div className="mx-auto max-w-lg">
      <div className="card p-7 text-center">
        <div className="font-display text-2xl font-extrabold text-ink">
          {cancelada ? "Tu suscripción terminó" : "No pudimos cobrar tu mes"}
        </div>
        <p className="mt-3 text-sm text-slatey">
          {cancelada
            ? "Diste de baja el Plan Individual y ya terminó el mes que tenías pago. "
            : "El último cobro de tu Plan Individual no se pudo hacer (por ejemplo, la tarjeta fue rechazada o venció). "}
          Tus datos están guardados.
        </p>
        {linkPago ? (
          <a href="/api/cobros/pagar" className="btn btn-accent mt-6 w-full">
            {cancelada ? "Volver a suscribirme" : "Pagar de nuevo"} · {precioUYU(PRECIO_MENSUAL_UYU.INDIVIDUAL)} por mes
          </a>
        ) : null}
        <a href={CONTACTO.whatsappLink} className={`btn mt-4 w-full ${linkPago ? "btn-ghost" : "btn-accent"}`}>
          Escribir por WhatsApp
        </a>
      </div>
    </div>
  );
}
