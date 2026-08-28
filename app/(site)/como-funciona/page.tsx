import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading, CTASection } from "@/components/site/ui";
import InteractiveScore from "@/components/demo/InteractiveScore";
import { RiskBadge } from "@/components/risk/RiskBadge";
import { computeRisk } from "@/lib/score/engine";
import { WORKED_EXAMPLES } from "@/lib/score/examples";

export const metadata: Metadata = {
  title: "Cómo funciona el score",
  description:
    "El detalle de los 4 sub-scores (ACWR, IFS, dolor y evento), el semáforo 0–7 y casos de referencia calculados en vivo.",
};

const SUBSCORES = [
  {
    t: "ACWR · Carga aguda : crónica",
    max: "máx. 2 pts",
    d: "Carga diaria = RPE × minutos. Se compara el promedio de los últimos 7 días (aguda) contra el de los últimos 28 (crónica).",
    rows: [
      ["ACWR ≤ 1.2", "0 pts"],
      ["1.21 – 1.3", "1 pt"],
      ["> 1.3", "2 pts"],
    ],
    note: "Zona óptima de referencia: 0.8 – 1.3. Período de calibración: los primeros ~14 días de registro este sub-score queda en 0, porque la carga crónica todavía se está construyendo y el ratio se dispararía solo. Los otros tres factores cuentan desde el día 1.",
  },
  {
    t: "IFS · Índice de fatiga subjetiva",
    max: "máx. 2 pts",
    d: "IFS = (Fatiga + Dolor + Estrés) − (Calidad del sueño × 2).",
    rows: [
      ["IFS < 10", "0 pts"],
      ["10 – 17", "1 pt"],
      ["≥ 18", "2 pts"],
    ],
  },
  {
    t: "Dolor persistente",
    max: "máx. 2 pts",
    d: "Se mira el dolor reportado en la misma zona durante los últimos días.",
    rows: [
      ["Dolor ≥ 5/10 durante ≥ 5 días, misma zona", "2 pts"],
      ["Dolor ocasional", "1 pt"],
      ["Sin dolor", "0 pts"],
    ],
  },
  {
    t: "Evento reciente",
    max: "máx. 1 pt",
    d: "Golpe, tirón, sobrecarga, calambres repetidos o molestia de lesión previa reportados en los últimos 7 días.",
    rows: [
      ["Hubo evento", "1 pt"],
      ["Sin evento", "0 pts"],
    ],
  },
];

export default function ComoFuncionaPage() {
  return (
    <>
      <section className="section bg-gradient-to-b from-mist to-white">
        <div className="wrap">
          <div className="eyebrow">Cómo funciona</div>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold text-ink sm:text-5xl">
            Un score de 0 a 7, calculado con evidencia y sin caja negra
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slatey">
            El score total es la suma de cuatro sub-scores. Cada uno se basa en indicadores usados
            en la literatura de prevención de lesiones. Nada de GPS ni wearables: solo lo que el
            deportista reporta en 2 minutos por día.
          </p>
        </div>
      </section>

      {/* Semáforo */}
      <section className="section">
        <div className="wrap">
          <SectionHeading eyebrow="Semáforo final" title="Qué significa cada nivel" />
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-slatey">
                  <th className="py-3 pr-4">Score</th>
                  <th className="py-3 pr-4">Nivel</th>
                  <th className="py-3 pr-4">Significado</th>
                  <th className="py-3">Acción sugerida</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["0–2", "risk-low", "Riesgo bajo", "Sin señales de acumulación relevantes.", "Entrena normal, sin restricciones."],
                  ["3–4", "risk-mod", "Riesgo moderado", "Hay señales de carga o fatiga acumulada.", "Vigilar, ajustar carga y priorizar recuperación activa."],
                  ["5–7", "risk-high", "Riesgo alto", "Alta probabilidad de lesión en 7–10 días.", "Reducir carga y coordinar evaluación médica."],
                ].map((r) => (
                  <tr key={r[0]} className="border-b border-line align-top">
                    <td className="py-4 pr-4 font-display font-bold text-ink">{r[0]}</td>
                    <td className="py-4 pr-4">
                      <span className="inline-flex items-center gap-2 font-semibold text-ink">
                        <span className={`risk-dot ${r[1]}`} style={{ background: "currentColor" }} />
                        {r[2]}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slatey">{r[3]}</td>
                    <td className="py-4 text-slatey">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-mist p-5 text-sm text-slatey">
            <span className="font-semibold text-ink">Regla clínica adicional.</span> Se marca riesgo
            alto también cuando el deportista cumple 2 o más de estos criterios: ACWR elevado, dolor
            persistente, fatiga alta + mal sueño, evento especial reciente.
          </div>
        </div>
      </section>

      {/* Sub-scores */}
      <section className="section bg-mist">
        <div className="wrap">
          <SectionHeading eyebrow="El detalle" title="Los cuatro sub-scores" />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {SUBSCORES.map((s) => (
              <div key={s.t} className="card p-6">
                <div className="flex items-center justify-between">
                  <div className="font-display text-base font-bold text-ink">{s.t}</div>
                  <span className="chip">{s.max}</span>
                </div>
                <p className="mt-2 text-sm text-slatey">{s.d}</p>
                <table className="mt-4 w-full text-sm">
                  <tbody>
                    {s.rows.map((r) => (
                      <tr key={r[0]} className="border-t border-line">
                        <td className="py-2 pr-4 text-slatey">{r[0]}</td>
                        <td className="py-2 text-right font-semibold text-ink">{r[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {s.note && <p className="mt-3 text-xs text-slatey">{s.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulador */}
      <section className="section">
        <div className="wrap">
          <SectionHeading eyebrow="Simulador" title="Probalo vos mismo" />
          <div className="mt-8">
            <InteractiveScore />
          </div>
        </div>
      </section>

      {/* Casos de referencia */}
      <section className="section bg-mist">
        <div className="wrap">
          <SectionHeading
            eyebrow="Casos de referencia"
            title="Tres escenarios, calculados en vivo"
            lead="Estos ejemplos se computan con el mismo motor que usa la plataforma al cargar esta página."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {WORKED_EXAMPLES.map((ex) => {
              const r = computeRisk({ dailyLogs: ex.dailyLogs, events: ex.events, asOf: ex.asOf });
              return (
                <div key={ex.id} className="card p-6">
                  <div className="flex items-center justify-between">
                    <div className="font-display text-base font-bold text-ink">{ex.title}</div>
                    <RiskBadge score={r.score} />
                  </div>
                  <p className="mt-2 text-sm text-slatey">{ex.summary}</p>
                  <ul className="mt-4 space-y-1 text-xs text-slatey">
                    {r.breakdown.map((b) => (
                      <li key={b.key} className="flex justify-between border-t border-line py-1.5">
                        <span>{b.label}</span>
                        <span className="font-semibold text-ink">{b.points}/{b.max}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roadmap fase 2 */}
      <section className="section">
        <div className="wrap">
          <div className="rounded-3xl border border-line bg-navy p-8 text-white sm:p-10">
            <div className="eyebrow">Próximamente</div>
            <h2 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">
              De reglas clínicas a modelo predictivo
            </h2>
            <p className="mt-3 max-w-2xl text-white/80">
              Hoy la predicción se basa en reglas clínicas y en el análisis de 30 días de tendencia:
              evolución de la fatiga, aumentos de carga sobre el 20%, frecuencia de dolor y ACWR
              fuera de rango. Con 6 a 12 semanas de datos acumulados, se pasa a un modelo predictivo
              (regresión logística / random forest / XGBoost) que clasifica automáticamente en
              &ldquo;sin lesión / molestia / lesión&rdquo;.
            </p>
            <Link href="/demo/panel" className="btn btn-accent mt-6">
              Ver el análisis de tendencia en el panel
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
