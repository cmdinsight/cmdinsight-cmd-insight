import { CONTACTO } from "@/lib/legal";
import { fmtFecha } from "@/lib/trial";

/** Pantalla que ve el deportista individual cuando su prueba de 30 días terminó. */
export function TrialVencido({ venceEl }: { venceEl: Date | null }) {
  return (
    <div className="mx-auto max-w-lg">
      <div className="card p-7 text-center">
        <div className="font-display text-2xl font-extrabold text-ink">
          Tu prueba de 30 días terminó
        </div>
        <p className="mt-3 text-sm text-slatey">
          {venceEl ? <>Venció el {fmtFecha(venceEl)}. </> : null}
          Tus datos están guardados. Para seguir usando tu control de carga y riesgo, escribinos y
          activamos tu cuenta.
        </p>
        <a href={CONTACTO.whatsappLink} className="btn btn-accent mt-6 w-full">
          Escribir por WhatsApp
        </a>
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
