import {
  computeRisk,
  dailyLoad,
  daysAgo,
  type RiskResult,
} from "@/lib/score/engine";
import { analyzeTrend } from "@/lib/score/trend";
import type { DailyLog, PerfilDeportista, SpecialEvent, WeeklyLog } from "@/lib/score/types";
import { getPerfil } from "@/lib/score/perfiles";
import { SemaphorePanel } from "@/components/risk/Semaphore";
import { LoadBars, Sparkline } from "@/components/charts/Charts";
import { RecomendacionesPanel } from "@/components/roster/RecomendacionesPanel";

function scoreHistory(
  dailyLogs: DailyLog[],
  events: SpecialEvent[],
  asOf: string,
  perfil: PerfilDeportista,
  days = 14,
) {
  const out: number[] = [];
  const end = Date.parse(asOf + "T00:00:00Z");
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end - i * 86_400_000).toISOString().slice(0, 10);
    out.push(computeRisk({ dailyLogs, events, asOf: d, perfil }).score);
  }
  return out;
}

export function PlayerInsight({
  dailyLogs,
  events,
  weekly,
  perfil = "EQUIPO",
  medico = false,
  conducta = false,
}: {
  dailyLogs: DailyLog[];
  events: SpecialEvent[];
  weekly?: WeeklyLog | null;
  perfil?: PerfilDeportista;
  medico?: boolean;
  /** Mostrar el panel de conducta preventiva sugerida (cuerpo técnico / médico / individual). */
  conducta?: boolean;
}) {
  const risk: RiskResult = computeRisk({ dailyLogs, events, weekly, perfil });
  const trend = analyzeTrend(dailyLogs, events, risk.asOf, perfil);
  const perfilCfg = getPerfil(perfil);

  const last28 = dailyLogs
    .filter((l) => {
      const d = daysAgo(l.date, risk.asOf);
      return d >= 0 && d < 28;
    })
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((l) => ({ label: l.date.slice(5), value: dailyLoad(l) }));

  const history = scoreHistory(dailyLogs, events, risk.asOf, perfil);
  const mostrarKm = perfilCfg.campos.km;

  return (
    <div className="space-y-6">
      {conducta && <RecomendacionesPanel risk={risk} trend={trend} />}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
        <SemaphorePanel score={risk.score} breakdown={risk.breakdown} />

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div className="font-display text-sm font-bold text-ink">Score de riesgo · últimos 14 días</div>
            <Sparkline data={history} width={140} height={38} />
          </div>
          <div className="mt-2 text-xs text-slatey">
            Tendencia {risk.trend === "up" ? "en aumento ↑" : risk.trend === "down" ? "a la baja ↓" : "estable →"} respecto de la semana pasada.
          </div>
        </div>

        {risk.alerts.length > 0 && (
          <div className="card p-5">
            <div className="font-display text-sm font-bold text-ink">Alertas automáticas</div>
            <ul className="mt-3 space-y-2 text-sm text-slatey">
              {risk.alerts.map((a) => (
                <li key={a.key} className="flex items-center gap-2">
                  <span
                    className={`risk-dot risk-${a.severity === "high" ? "high" : "mod"}`}
                    style={{ background: "currentColor" }}
                  />
                  {a.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div className="font-display text-sm font-bold text-ink">Carga diaria · 28 días</div>
            <span className="chip">{perfilCfg.label}</span>
          </div>
          <p className="text-xs text-slatey">
            Barras = RPE × minutos. Línea llena = promedio 7 días · línea punteada = promedio 28 días.
          </p>
          <div className="mt-3">
            <LoadBars
              data={last28}
              acute={risk.acwr.acute}
              chronic={risk.acwr.chronic}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slatey">
            <span>Aguda: <b className="text-ink">{Math.round(risk.acwr.acute)}</b></span>
            <span>Crónica: <b className="text-ink">{Math.round(risk.acwr.chronic)}</b></span>
            <span>
              ACWR:{" "}
              <b className={risk.acwr.inOptimalZone ? "text-ink" : "risk-high"}>
                {risk.acwr.ratio ? risk.acwr.ratio.toFixed(2) : "—"}
              </b>{" "}
              (óptimo {perfilCfg.acwr.optimo[0]}–{perfilCfg.acwr.optimo[1]})
            </span>
            {mostrarKm && (
              <span>
                Km última semana:{" "}
                <b className="text-ink">
                  {Math.round(
                    dailyLogs
                      .filter((l) => {
                        const d = daysAgo(l.date, risk.asOf);
                        return d >= 0 && d < 7;
                      })
                      .reduce((s, l) => s + (l.km ?? 0), 0),
                  )}
                </b>
              </span>
            )}
          </div>
        </div>

        <div className="card p-5">
          <div className="font-display text-sm font-bold text-ink">
            Análisis de tendencia · {trend.daysAnalyzed} días
          </div>
          <p className="mt-2 text-sm text-slatey">{trend.narrative}</p>
          {trend.factors.length > 0 && (
            <ul className="mt-3 space-y-2">
              {trend.factors.map((f) => (
                <li key={f.key} className="rounded-lg border border-line bg-mist p-3">
                  <div className="text-sm font-semibold text-ink">{f.label}</div>
                  <div className="text-xs text-slatey">{f.detail}</div>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-slatey">
            Próximamente: modelo predictivo entrenado con 6–12 semanas de datos.
          </p>
        </div>

        {medico && (
          <div className="card p-5">
            <div className="font-display text-sm font-bold text-ink">Criterios clínicos de riesgo alto</div>
            <ul className="mt-3 space-y-1.5 text-sm">
              {risk.clinical.criteria.map((c) => (
                <li key={c.key} className="flex items-center gap-2">
                  <span className={c.met ? "risk-high" : "text-slatey"}>{c.met ? "●" : "○"}</span>
                  <span className={c.met ? "font-medium text-ink" : "text-slatey"}>{c.label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-slatey">
              {risk.clinical.metCount} de 4 criterios ·{" "}
              {risk.clinical.highRisk ? "marca riesgo alto" : "sin marca clínica"}.
            </p>
            {risk.event.recent.length > 0 && (
              <div className="mt-3 border-t border-line pt-3 text-xs text-slatey">
                <div className="font-semibold text-ink">Eventos recientes</div>
                {risk.event.recent.map((e, i) => (
                  <div key={i}>
                    {e.date}: {e.tipos.join(", ")}
                    {e.comentario ? ` — "${e.comentario}"` : ""}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
