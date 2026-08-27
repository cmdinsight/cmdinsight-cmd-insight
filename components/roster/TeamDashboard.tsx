import Link from "next/link";
import type { RiskResult } from "@/lib/score/engine";
import { RiskBadge, TrendArrow } from "@/components/risk/RiskBadge";
import { SimpleBars } from "@/components/charts/Charts";
import type { EmergenteEntry } from "@/lib/roster";

export type { EmergenteEntry };

export interface RosterEntry {
  id: string;
  nombre: string;
  posicion: string | null;
  dorsal: number | null;
  grupo?: string | null;
  risk: RiskResult;
}

export function TeamDashboard({
  title,
  asOfLabel,
  players,
  weeklyLoad,
  emergentes,
  linkBase,
}: {
  title: string;
  asOfLabel: string;
  players: RosterEntry[];
  weeklyLoad: { label: string; value: number }[];
  emergentes: EmergenteEntry[];
  linkBase: string;
}) {
  const ranked = [...players].sort((a, b) => b.risk.score - a.risk.score);
  const total = players.length || 1;

  const disponibles = players.filter((p) => p.risk.score < 3).length;
  const recuperacion = players.filter((p) => p.risk.score >= 3 && p.risk.score < 5).length;
  const riesgo = players.filter((p) => p.risk.score >= 5).length;

  const conDolor = players.filter(
    (p) => (p.risk.latestLog?.dolor ?? 0) >= 3 || p.risk.pain.points > 0,
  );
  const pctDolor = Math.round((conDolor.length / total) * 100);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="eyebrow">Cuerpo técnico / médico</div>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-ink">{title}</h1>
          <p className="text-sm text-slatey">
            {asOfLabel} · {players.length} {players.length === 1 ? "deportista" : "deportistas"}
          </p>
        </div>
      </div>

      {players.length === 0 ? (
        <div className="card mt-6 p-8 text-sm text-slatey">
          Todavía no hay deportistas con datos cargados.
        </div>
      ) : (
        <>
          {/* Informe de lunes */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { t: "Disponibles", n: disponibles, c: "risk-low", d: "Score 0–2" },
              { t: "En recuperación", n: recuperacion, c: "risk-mod", d: "Score 3–4" },
              { t: "En riesgo", n: riesgo, c: "risk-high", d: "Score 5–7" },
            ].map((k) => (
              <div key={k.t} className="card p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slatey">
                  <span className={`risk-dot ${k.c}`} style={{ background: "currentColor" }} />
                  {k.t}
                </div>
                <div className="mt-1 font-display text-3xl font-extrabold text-ink">{k.n}</div>
                <div className="text-xs text-slatey">{k.d}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="card overflow-hidden">
              <div className="border-b border-line p-4 font-display text-sm font-bold text-ink">
                Ranking por riesgo
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-line text-xs uppercase tracking-wide text-slatey">
                      <th className="px-4 py-2.5">Deportista</th>
                      <th className="px-4 py-2.5">Riesgo</th>
                      <th className="px-4 py-2.5">Tend.</th>
                      <th className="px-4 py-2.5">Zona</th>
                      <th className="px-4 py-2.5">ACWR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranked.map((p) => (
                      <tr key={p.id} className="border-b border-line last:border-0 hover:bg-mist">
                        <td className="px-4 py-3">
                          <Link href={`${linkBase}/${p.id}`} className="font-semibold text-ink hover:underline">
                            {p.nombre}
                          </Link>
                          <div className="text-xs text-slatey">
                            {p.dorsal != null ? `#${p.dorsal} · ` : ""}
                            {p.posicion || p.grupo || "—"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <RiskBadge score={p.risk.score} />
                        </td>
                        <td className="px-4 py-3">
                          <TrendArrow trend={p.risk.trend} />
                        </td>
                        <td className="px-4 py-3 text-slatey">
                          {p.risk.latestLog && p.risk.latestLog.zona !== "Ninguna"
                            ? p.risk.latestLog.zona
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={p.risk.acwr.inOptimalZone ? "text-slatey" : "risk-high font-semibold"}>
                            {p.risk.acwr.ratio ? p.risk.acwr.ratio.toFixed(2) : "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <div className="card p-5">
                <div className="font-display text-sm font-bold text-ink">Plantel con dolor activo</div>
                <div className="mt-1 font-display text-3xl font-extrabold text-ink">{pctDolor}%</div>
                <div className="text-xs text-slatey">
                  {conDolor.length} de {players.length}
                </div>
              </div>

              <div className="card p-5">
                <div className="font-display text-sm font-bold text-ink">Carga semanal del equipo</div>
                <div className="mt-2">
                  <SimpleBars data={weeklyLoad} />
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-4 p-5">
            <div className="font-display text-sm font-bold text-ink">
              Molestias y eventos emergentes · últimos 10 días
            </div>
            {emergentes.length === 0 ? (
              <p className="mt-2 text-sm text-slatey">Sin eventos reportados.</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {emergentes.map((e, i) => (
                  <li key={i} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 text-sm">
                    <span className="text-xs text-slatey">{e.date}</span>
                    <Link href={`${linkBase}/${e.id}`} className="font-semibold text-ink hover:underline">
                      {e.nombre}
                    </Link>
                    <span className="text-slatey">{e.text}</span>
                    {e.comentario && (
                      <span className="text-xs text-slatey">— &ldquo;{e.comentario}&rdquo;</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
