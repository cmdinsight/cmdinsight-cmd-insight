"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { computeRisk, type RiskResult } from "@/lib/score/engine";
import { effectiveAthleteData, loadState, resetState } from "@/components/demo/store";
import { RiskBadge } from "@/components/risk/RiskBadge";
import { getPlayer, DEMO_ATHLETE_ID } from "@/lib/demo/data";

const FORMS = [
  {
    href: "/demo/deportista/control-diario",
    t: "Control diario",
    d: "Después de cada entrenamiento o partido. Carga, dolor, fatiga, sueño y estrés. 2 minutos.",
  },
  {
    href: "/demo/deportista/control-semanal",
    t: "Control semanal",
    d: "Una vez por semana. Detecta el riesgo que se viene acumulando.",
  },
  {
    href: "/demo/deportista/evento",
    t: "Evento o molestia especial",
    d: "Solo cuando pasa algo puntual: un golpe, un tirón, calambres.",
  },
];

export default function AthleteHome() {
  const athleteName = getPlayer(DEMO_ATHLETE_ID)?.nombre ?? "Deportista demo";
  const [risk, setRisk] = useState<RiskResult | null>(null);
  const [localCount, setLocalCount] = useState(0);

  useEffect(() => {
    const { dailyLogs, weekly, events } = effectiveAthleteData();
    setRisk(computeRisk({ dailyLogs, events, weekly }));
    const s = loadState();
    setLocalCount(s.daily.length + s.weekly.length + s.events.length);
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow">Deportista</div>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-ink">Hola, {athleteName}</h1>
          <p className="mt-1 text-sm text-slatey">
            Completá tus formularios con sinceridad. Nos ayuda a cuidar tu salud y prevenir lesiones.
          </p>
        </div>
        {risk && (
          <div className="text-right">
            <RiskBadge score={risk.score} trend={risk.trend} />
          </div>
        )}
      </div>

      {risk && (
        <Link
          href="/demo/deportista/mi-score"
          className="mt-6 flex items-center justify-between rounded-2xl border border-line bg-white p-5 transition-shadow hover:shadow-card"
        >
          <div>
            <div className="text-sm text-slatey">Tu score de riesgo hoy</div>
            <div className="font-display text-3xl font-extrabold text-ink">
              {risk.score}
              <span className="text-lg text-slatey">/7</span> · {risk.semaphore.label}
            </div>
            <div className="mt-1 text-sm text-slatey">{risk.semaphore.accion}</div>
          </div>
          <span className="text-navy">Ver detalle →</span>
        </Link>
      )}

      <div className="mt-6 grid gap-4">
        {FORMS.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="card flex items-center justify-between p-5 transition-shadow hover:shadow-pop"
          >
            <div>
              <div className="font-display text-base font-bold text-ink">{f.t}</div>
              <p className="mt-1 text-sm text-slatey">{f.d}</p>
            </div>
            <span className="ml-4 text-navy">→</span>
          </Link>
        ))}
      </div>

      {localCount > 0 && (
        <button
          onClick={() => {
            resetState();
            window.location.reload();
          }}
          className="mt-6 text-sm text-slatey underline"
        >
          Borrar mis {localCount} entradas de prueba y volver al estado inicial
        </button>
      )}
    </div>
  );
}
