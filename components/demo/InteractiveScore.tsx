"use client";

import { useMemo, useState } from "react";
import { computeRisk } from "@/lib/score/engine";
import type { DailyLog, PainZone, SpecialEvent } from "@/lib/score/types";
import { SemaphorePanel } from "@/components/risk/Semaphore";

const AS_OF = "2026-06-30";

function iso(daysBack: number) {
  return new Date(Date.parse(AS_OF + "T00:00:00Z") - daysBack * 86_400_000)
    .toISOString()
    .slice(0, 10);
}

/** Construye una semana simulada sobre una base crónica moderada. */
function buildHistory(v: {
  rpe: number;
  minutes: number;
  dolor: number;
  zona: PainZone;
  fatiga: number;
  sueno: number;
  estres: number;
}): DailyLog[] {
  const logs: DailyLog[] = [];
  for (let d = 27; d >= 7; d--) {
    logs.push({
      date: iso(d),
      rpe: 5,
      minutes: 80,
      dolor: 0,
      zona: "Ninguna",
      fatiga: 3,
      sueno: 4,
      estres: 2,
    });
  }
  for (let d = 6; d >= 0; d--) {
    logs.push({
      date: iso(d),
      rpe: v.rpe,
      minutes: v.minutes,
      dolor: v.dolor,
      zona: v.dolor >= 3 ? v.zona : "Ninguna",
      fatiga: v.fatiga,
      sueno: v.sueno,
      estres: v.estres,
    });
  }
  return logs;
}

function Scale({
  label,
  hint,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  min: number;
  max: number;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-slatey">{label}</span>
        <span className="font-display text-lg font-bold text-navy">{value}</span>
      </div>
      {hint && <p className="mb-2 text-xs text-slatey">{hint}</p>}
      <input
        type="range"
        className="scale"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export default function InteractiveScore() {
  const [rpe, setRpe] = useState(8);
  const [minutes, setMinutes] = useState(100);
  const [dolor, setDolor] = useState(5);
  const [zona, setZona] = useState<PainZone>("Isquiotibiales");
  const [fatiga, setFatiga] = useState(7);
  const [sueno, setSueno] = useState(2);
  const [estres, setEstres] = useState(5);
  const [evento, setEvento] = useState(false);

  const result = useMemo(() => {
    const dailyLogs = buildHistory({ rpe, minutes, dolor, zona, fatiga, sueno, estres });
    const events: SpecialEvent[] = evento
      ? [{ date: iso(1), tipos: ["Tirón muscular"] }]
      : [];
    return computeRisk({ dailyLogs, events, asOf: AS_OF });
  }, [rpe, minutes, dolor, zona, fatiga, sueno, estres, evento]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card p-5 sm:p-6">
        <div className="mb-4">
          <div className="eyebrow">Simulador</div>
          <h3 className="font-display text-lg font-bold text-ink">
            Simulá la última semana de un jugador
          </h3>
          <p className="mt-1 text-sm text-slatey">
            Movés las escalas y el score se recalcula con la misma lógica que usa la plataforma.
          </p>
        </div>

        <div className="grid gap-5">
          <Scale label="Carga percibida (RPE)" hint="0 = descanso · 10 = extremadamente exigente" min={0} max={10} value={rpe} onChange={setRpe} />
          <Scale label="Duración (minutos)" min={0} max={130} value={minutes} onChange={setMinutes} />
          <Scale label="Dolor muscular" hint="0 = sin dolor · 10 = dolor muy intenso" min={0} max={10} value={dolor} onChange={setDolor} />
          <div>
            <span className="label">Zona principal de dolor</span>
            <select className="input" value={zona} onChange={(e) => setZona(e.target.value as PainZone)}>
              {["Ninguna", "Isquiotibiales", "Cuádriceps", "Gemelos", "Aductores", "Rodilla", "Tobillo", "Cadera", "Espalda", "Otra"].map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>
          <Scale label="Fatiga general" hint="0 = fresco · 10 = agotado" min={0} max={10} value={fatiga} onChange={setFatiga} />
          <Scale label="Calidad del sueño" hint="1 = muy malo · 5 = excelente" min={1} max={5} value={sueno} onChange={setSueno} />
          <Scale label="Estrés / cansancio mental" min={0} max={10} value={estres} onChange={setEstres} />
          <label className="flex items-center gap-3 rounded-xl border border-line bg-mist p-3 text-sm font-medium text-ink">
            <input type="checkbox" checked={evento} onChange={(e) => setEvento(e.target.checked)} className="h-4 w-4" />
            Reportó un evento especial esta semana (golpe, tirón, calambres…)
          </label>
        </div>
      </div>

      <div>
        <SemaphorePanel score={result.score} breakdown={result.breakdown} />
        {result.clinical.highRisk && (
          <div className="mt-4 rounded-xl border border-risk-high/30 bg-risk-high-bg p-4 text-sm">
            <span className="font-bold text-[#b91c1c]">Alerta clínica:</span> cumple{" "}
            {result.clinical.metCount} de 4 criterios de riesgo alto (
            {result.clinical.criteria.filter((c) => c.met).map((c) => c.label).join(", ")}).
          </div>
        )}
      </div>
    </div>
  );
}
