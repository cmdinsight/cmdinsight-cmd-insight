import type { RiskResult } from "@/lib/score/engine";
import type { TrendAnalysis } from "@/lib/score/trend";
import { recomendaciones, type Prioridad } from "@/lib/score/recomendaciones";

const DOT: Record<Prioridad, string> = {
  alta: "risk-high",
  media: "risk-mod",
  baja: "risk-low",
};
const LABEL: Record<Prioridad, string> = {
  alta: "Prioridad alta",
  media: "Prioridad media",
  baja: "Prioridad baja",
};

export function RecomendacionesPanel({
  risk,
  trend,
}: {
  risk: RiskResult;
  trend?: TrendAnalysis;
}) {
  const items = recomendaciones(risk, trend);
  const esAlto = risk.semaphore.level === "alto";

  return (
    <div className={`card p-5 ${esAlto ? "ring-1 ring-risk-high/30" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="font-display text-sm font-bold text-ink">Conducta preventiva sugerida</div>
        {esAlto && (
          <span className="risk-badge high">Requiere acción</span>
        )}
      </div>
      <p className="mt-1 text-xs text-slatey">
        Generada a partir de los factores que están elevando el score. No reemplaza el criterio
        clínico del equipo médico.
      </p>

      <ol className="mt-4 space-y-3">
        {items.map((r, i) => (
          <li key={i} className="rounded-xl border border-line bg-mist p-3">
            <div className="flex items-center gap-2">
              <span className={`risk-dot ${DOT[r.prioridad]}`} style={{ background: "currentColor" }} />
              <span className="text-xs font-semibold uppercase tracking-wide text-slatey">
                {LABEL[r.prioridad]}
              </span>
            </div>
            <div className="mt-1 text-sm font-semibold text-ink">{r.titulo}</div>
            <p className="mt-0.5 text-sm text-slatey">{r.detalle}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
