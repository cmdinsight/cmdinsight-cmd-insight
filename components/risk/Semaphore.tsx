import { semaphore } from "@/lib/score/engine";
import type { RiskBreakdownItem } from "@/lib/score/engine";
import { FACTOR_SIMPLE } from "@/lib/score/lenguaje";

const TONE: Record<string, { bg: string; ring: string; text: string; dot: string }> = {
  low: { bg: "bg-risk-low-bg", ring: "ring-risk-low/30", text: "text-[#15803d]", dot: "bg-risk-low" },
  mod: { bg: "bg-risk-mod-bg", ring: "ring-risk-mod/30", text: "text-[#b45309]", dot: "bg-risk-mod" },
  high: { bg: "bg-risk-high-bg", ring: "ring-risk-high/30", text: "text-[#b91c1c]", dot: "bg-risk-high" },
};

export function SemaphoreLights({ active }: { active: "low" | "mod" | "high" }) {
  const order: Array<"low" | "mod" | "high"> = ["low", "mod", "high"];
  return (
    <div className="inline-flex flex-col gap-2 rounded-2xl bg-ink/90 p-3">
      {order.map((c) => (
        <span
          key={c}
          className={`h-6 w-6 rounded-full transition-opacity ${TONE[c].dot} ${
            active === c ? "opacity-100 shadow-[0_0_16px_currentColor]" : "opacity-20"
          }`}
        />
      ))}
    </div>
  );
}

export function SemaphorePanel({
  score,
  breakdown,
  tono = "tecnico",
  calibrando = false,
}: {
  score: number;
  breakdown?: RiskBreakdownItem[];
  /** "simple": etiquetas sin jerga + una línea de "qué es" (deportista individual). */
  tono?: "tecnico" | "simple";
  /** Muestra "en calibración" en el sub-score de carga en vez de "0 / 2 pts". */
  calibrando?: boolean;
}) {
  const s = semaphore(score);
  const tone = TONE[s.color];
  const simple = tono === "simple";

  return (
    <div className={`card p-5 sm:p-6 ring-1 ${tone.ring} ${tone.bg}`}>
      <div className="flex items-center gap-4">
        <SemaphoreLights active={s.color} />
        <div>
          <div className={`text-sm font-bold uppercase tracking-wide ${tone.text}`}>
            {s.label}
          </div>
          <div className="font-display text-4xl font-extrabold text-ink">
            {score}
            <span className="text-xl text-slatey">/7</span>
          </div>
          <div className="mt-1 text-sm text-slatey">{s.significado}</div>
        </div>
      </div>

      <div className={`mt-4 rounded-xl bg-white/70 p-3 text-sm font-medium ${tone.text}`}>
        {simple ? "Qué hacer" : "Acción sugerida"}: <span className="text-ink">{s.accion}</span>
      </div>

      {breakdown && (
        <div className="mt-4 grid gap-2">
          {breakdown.map((b) => {
            const sc = simple ? FACTOR_SIMPLE[b.key] : undefined;
            const esCargaEnCalibracion = b.key === "acwr" && calibrando;
            return (
              <div key={b.key} className="rounded-xl border border-line bg-white p-3">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-semibold text-ink">{sc?.titulo ?? b.label}</span>
                  <span className="chip flex-none">
                    {esCargaEnCalibracion ? "en calibración" : `${b.points} / ${b.max} pts`}
                  </span>
                </div>
                {sc && <p className="mt-1 text-xs text-slatey">{sc.queEs}</p>}
                <p className={`${sc ? "mt-1.5 border-t border-line pt-1.5" : "mt-1"} text-xs text-slatey`}>
                  {b.detail}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
