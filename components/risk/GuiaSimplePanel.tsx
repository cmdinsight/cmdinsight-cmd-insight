import type { RiskResult } from "@/lib/score/engine";
import { guiaSimple, nivelEnCriollo } from "@/lib/score/lenguaje";

/** Versión en criollo de la "conducta preventiva", para el deportista individual. */
export function GuiaSimplePanel({ risk }: { risk: RiskResult }) {
  const tips = guiaSimple(risk);
  const alto = risk.semaphore.level === "alto";

  return (
    <div className={`card p-5 ${alto ? "ring-1 ring-risk-high/30" : ""}`}>
      <div className="font-display text-sm font-bold text-ink">Qué te conviene hacer</div>
      <p className="mt-1 text-sm text-slatey">{nivelEnCriollo(risk)}</p>

      <ul className="mt-4 space-y-2">
        {tips.map((t, i) => (
          <li key={i} className="flex gap-2 rounded-xl border border-line bg-mist p-3 text-sm text-ink">
            <span className="mt-0.5 flex-none text-teal">→</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs text-slatey">
        Es una orientación automática de autocontrol. No reemplaza la consulta con un médico o
        preparador físico.
      </p>
    </div>
  );
}
