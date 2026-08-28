"use client";

import { useEffect, useState } from "react";
import type { PerfilDeportista, SpecialEventType } from "@/lib/score/types";
import { getPerfil } from "@/lib/score/perfiles";
import { computeRisk, type RiskResult } from "@/lib/score/engine";
import { Field, MultiChips } from "@/components/demo/fields";
import { addEvent, effectiveAthleteData, loadPerfil, todayISO } from "@/components/demo/store";
import { FormResult } from "@/components/demo/FormResult";

export default function EventoPage() {
  const [perfil, setPerfilState] = useState<PerfilDeportista | null>(null);
  const [tipos, setTipos] = useState<SpecialEventType[]>([]);
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RiskResult | null>(null);

  useEffect(() => {
    setPerfilState(loadPerfil());
  }, []);

  if (result) return <FormResult risk={result} title="Evento especial registrado" />;
  if (!perfil) return <div className="card p-8 text-sm text-slatey">Cargando el formulario…</div>;

  const eventos = getPerfil(perfil).eventos;

  const submit = () => {
    if (tipos.length === 0) {
      setError("Marcá al menos un evento.");
      return;
    }
    addEvent({ date: todayISO(), tipos, comentario: comentario.trim() || undefined });
    const { dailyLogs, weekly, events, perfil: pf } = effectiveAthleteData();
    setResult(computeRisk({ dailyLogs, events, weekly, perfil: pf }));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="eyebrow">Formulario 3 · solo si ocurre algo puntual</div>
      <h1 className="mt-1 font-display text-2xl font-extrabold text-ink">Evento o molestia especial</h1>
      <p className="mt-2 text-sm text-slatey">
        Si pasó algo hoy —un golpe, un tirón, calambres— registralo en el momento.
      </p>

      <div className="card mt-6 p-5 sm:p-7">
        <Field label="¿Ocurrió alguno de estos eventos?" hint="Podés marcar más de uno">
          <MultiChips options={eventos} value={tipos} onChange={setTipos} />
        </Field>
        <Field label="Comentario breve (opcional)">
          <textarea
            className="input"
            rows={3}
            placeholder="Contá qué pasó, dónde y en qué momento del entrenamiento."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </Field>

        {error && <p className="mt-4 text-sm font-medium text-[#b91c1c]">{error}</p>}

        <button onClick={submit} className="btn btn-primary btn-lg mt-6 w-full sm:w-auto">
          Registrar evento
        </button>
      </div>
    </div>
  );
}
