"use client";

import { useState } from "react";
import { computeRisk, type RiskResult } from "@/lib/score/engine";
import { Field, ChipScale, YesNo } from "@/components/demo/fields";
import { addWeekly, effectiveAthleteData, weekStartISO } from "@/components/demo/store";
import { FormResult } from "@/components/demo/FormResult";

export default function ControlSemanalPage() {
  const [dolorPersistente, setDolorPersistente] = useState<boolean | null>(null);
  const [dolorLimito, setDolorLimito] = useState<boolean | null>(null);
  const [piernas, setPiernas] = useState<number | null>(null);
  const [horas, setHoras] = useState<string>("");
  const [entrenoConDolor, setEntrenoConDolor] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RiskResult | null>(null);

  if (result) return <FormResult risk={result} title="Seguimiento semanal cargado" tono="simple" />;

  const submit = () => {
    const h = Number(horas);
    if (
      dolorPersistente == null ||
      dolorLimito == null ||
      piernas == null ||
      entrenoConDolor == null ||
      !horas ||
      Number.isNaN(h) ||
      h <= 0 ||
      h > 16
    ) {
      setError("Completá todas las preguntas y unas horas de sueño válidas.");
      return;
    }
    addWeekly({
      weekStart: weekStartISO(),
      dolorPersistente,
      dolorLimitoRendimiento: dolorLimito,
      piernasPesadas: piernas,
      horasSueno: h,
      entrenoConDolor,
    });
    const { dailyLogs, weekly, events, perfil } = effectiveAthleteData();
    setResult(computeRisk({ dailyLogs, events, weekly, perfil }));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="eyebrow">Formulario 2 · una vez por semana</div>
      <h1 className="mt-1 font-display text-2xl font-extrabold text-ink">Seguimiento semanal de salud</h1>
      <p className="mt-2 text-sm text-slatey">
        Esto nos permite detectar riesgos antes de que aparezca una lesión.
      </p>

      <div className="card mt-6 p-5 sm:p-7">
        <Field n={1} label="¿Tuviste dolor en la misma zona durante más de 5 días esta semana?">
          <YesNo value={dolorPersistente} onChange={setDolorPersistente} />
        </Field>
        <Field n={2} label="¿Sentís que alguna molestia afectó tu rendimiento esta semana?">
          <YesNo value={dolorLimito} onChange={setDolorLimito} />
        </Field>
        <Field n={3} label="¿Qué tan pesadas sentiste las piernas esta semana?">
          <ChipScale min={0} max={10} value={piernas} onChange={setPiernas} lowLabel="0 · livianas" highLabel="10 · muy pesadas" />
        </Field>
        <Field n={4} label="Horas promedio de sueño por noche esta semana" hint="Podés usar decimales (ej: 6.5)">
          <input
            className="input max-w-[160px]"
            type="number"
            inputMode="decimal"
            step="0.1"
            min={1}
            max={16}
            placeholder="6.5"
            value={horas}
            onChange={(e) => setHoras(e.target.value)}
          />
        </Field>
        <Field n={5} label="¿Jugaste o entrenaste con dolor?">
          <YesNo value={entrenoConDolor} onChange={setEntrenoConDolor} />
        </Field>

        {error && <p className="mt-4 text-sm font-medium text-[#b91c1c]">{error}</p>}

        <button onClick={submit} className="btn btn-primary btn-lg mt-6 w-full sm:w-auto">
          Guardar seguimiento semanal
        </button>
      </div>
    </div>
  );
}
