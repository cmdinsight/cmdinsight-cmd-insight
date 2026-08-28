import type { CalibracionInfo } from "@/lib/score/engine";

/**
 * Cartel que explica el período de calibración del score: los primeros días
 * la "carga crónica" está a medio construir, así que el sub-score de carga
 * (ACWR) no cuenta todavía. El resto del score sí es válido desde el día 1.
 */
export function CalibracionAviso({
  calibracion,
  tono = "tecnico",
}: {
  calibracion: CalibracionInfo;
  tono?: "tecnico" | "simple";
}) {
  if (!calibracion.activa) return null;
  const { diasRegistrados, total, diasFaltantes } = calibracion;
  const pct = Math.min(100, Math.round((diasRegistrados / total) * 100));

  return (
    <div className="rounded-2xl border border-navy/20 bg-navy/[0.04] p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="font-display text-sm font-bold text-navy">
          Tu score se está calibrando
        </div>
        <span className="chip">
          Día {diasRegistrados} de {total}
        </span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-navy/10">
        <div className="h-full rounded-full bg-navy transition-all" style={{ width: `${pct}%` }} />
      </div>

      <p className="mt-3 text-sm text-slatey">
        {tono === "simple" ? (
          <>
            Para saber si tu carga de entrenamiento subió demasiado, el sistema necesita conocer
            primero tu ritmo habitual. Eso lleva unas <b>dos semanas</b> de registros. Te faltan{" "}
            <b>{diasFaltantes} {diasFaltantes === 1 ? "día" : "días"}</b>.
            <br />
            Mientras tanto, tu score ya tiene en cuenta el <b>dolor</b>, la <b>fatiga</b>, el{" "}
            <b>sueño</b> y los <b>eventos</b> — eso funciona desde el primer día.
          </>
        ) : (
          <>
            La carga crónica (promedio de 28 días) todavía se está construyendo, así que el ratio
            aguda:crónica se dispararía solo. El sub-score de carga (ACWR) queda en 0 hasta completar
            ~2 semanas de registros ({diasFaltantes} {diasFaltantes === 1 ? "día" : "días"} más). Los
            demás factores —IFS, dolor persistente y eventos— sí se calculan normalmente.
          </>
        )}
      </p>
    </div>
  );
}
