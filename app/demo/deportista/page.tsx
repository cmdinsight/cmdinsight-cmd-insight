"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { computeRisk, type RiskResult } from "@/lib/score/engine";
import type { PerfilDeportista } from "@/lib/score/types";
import { PERFIL_OPCIONES, getPerfil } from "@/lib/score/perfiles";
import { effectiveAthleteData, loadState, resetState, setPerfil } from "@/components/demo/store";
import { RiskBadge } from "@/components/risk/RiskBadge";
import { getDemoAthlete } from "@/lib/demo/data";

const FORMS = [
  {
    href: "/demo/deportista/control-diario",
    t: "Control diario",
    d: "Después de cada entrenamiento o sesión. Carga, dolor, fatiga, sueño y estrés. 2 minutos.",
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
  const [perfil, setPerfilState] = useState<PerfilDeportista | null>(null);
  const [risk, setRisk] = useState<RiskResult | null>(null);
  const [localCount, setLocalCount] = useState(0);

  const refresh = (p?: PerfilDeportista) => {
    const { dailyLogs, weekly, events, perfil: pf } = effectiveAthleteData(p);
    setPerfilState(pf);
    setRisk(computeRisk({ dailyLogs, events, weekly, perfil: pf }));
    const s = loadState();
    setLocalCount(s.daily.length + s.weekly.length + s.events.length);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const elegir = (p: PerfilDeportista) => {
    setPerfil(p);
    refresh(p);
  };

  const athlete = perfil ? getDemoAthlete(perfil) : null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow">Deportista</div>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-ink">
            Hola, {athlete?.nombre ?? "…"}
          </h1>
          <p className="mt-1 text-sm text-slatey">
            {athlete?.contexto ?? "Completá tus formularios con sinceridad. Nos ayuda a cuidar tu salud."}
          </p>
        </div>
        {risk && (
          <div className="text-right">
            <RiskBadge score={risk.score} trend={risk.trend} />
          </div>
        )}
      </div>

      <div className="card mt-6 p-5">
        <div className="font-display text-sm font-bold text-ink">
          ¿Qué tipo de deportista querés simular?
        </div>
        <p className="mt-1 text-xs text-slatey">
          Cambia las preguntas de los formularios, las zonas de dolor y cómo se calcula el score.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PERFIL_OPCIONES.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => elegir(o.value)}
              aria-pressed={perfil === o.value}
              className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                perfil === o.value
                  ? "border-navy bg-navy text-white"
                  : "border-line bg-white text-ink hover:border-navy/40"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        {perfil && (
          <p className="mt-3 text-xs text-slatey">{getPerfil(perfil).descripcion}</p>
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
