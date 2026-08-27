"use client";

import { useState } from "react";
import { PAIN_ZONES, type PainZone } from "@/lib/score/types";
import { Field, ChipScale, SleepScale } from "@/components/demo/fields";
import { FormResult } from "@/components/demo/FormResult";
import { FormConfirmacion } from "@/components/app/FormConfirmacion";

export default function ControlDiarioPage() {
  const [rpe, setRpe] = useState<number | null>(null);
  const [minutes, setMinutes] = useState("");
  const [dolor, setDolor] = useState<number | null>(null);
  const [zona, setZona] = useState<PainZone>("Ninguna");
  const [fatiga, setFatiga] = useState<number | null>(null);
  const [sueno, setSueno] = useState<number | null>(null);
  const [estres, setEstres] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (result) {
    return result.mostrarRiesgo && result.risk ? (
      <FormResult
        risk={result.risk}
        title="Control diario cargado"
        backHref="/app/mi"
        evolucionHref="/app/mi/evolucion"
      />
    ) : (
      <FormConfirmacion titulo="Control diario cargado" />
    );
  }

  const submit = async () => {
    const mins = Number(minutes);
    if (
      rpe == null || dolor == null || fatiga == null || sueno == null || estres == null ||
      !minutes || Number.isNaN(mins) || mins <= 0
    ) {
      setError("Completá todas las escalas y la duración del entrenamiento.");
      return;
    }
    setError(null);
    setLoading(true);
    const res = await fetch("/api/controles/diario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: new Date().toISOString().slice(0, 10),
        rpe,
        minutes: Math.round(mins),
        dolor,
        zona: dolor >= 1 ? zona : "Ninguna",
        fatiga,
        sueno,
        estres,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "No se pudo guardar.");
      setLoading(false);
      return;
    }
    setResult(data);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="eyebrow">Formulario 1 · después de cada entrenamiento o partido</div>
      <h1 className="mt-1 font-display text-2xl font-extrabold text-ink">
        Control diario de carga y bienestar
      </h1>
      <p className="mt-2 text-sm text-slatey">
        Este formulario nos ayuda a cuidar tu salud y prevenir lesiones. Completalo con sinceridad.
        No lleva más de 2 minutos.
      </p>

      <div className="card mt-6 p-5 sm:p-7">
        <Field n={1} label="¿Qué tan exigente sentiste el entrenamiento de hoy?" hint="Carga percibida (RPE)">
          <ChipScale min={0} max={10} value={rpe} onChange={setRpe} lowLabel="0 · descanso" highLabel="10 · extremadamente exigente" />
        </Field>
        <Field n={2} label="¿Cuántos minutos duró el entrenamiento o partido?">
          <input className="input max-w-[160px]" type="number" inputMode="numeric" min={1} placeholder="90" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
        </Field>
        <Field n={3} label="¿Tenés dolor muscular o articular en este momento?">
          <ChipScale min={0} max={10} value={dolor} onChange={setDolor} lowLabel="0 · sin dolor" highLabel="10 · dolor muy intenso" />
        </Field>
        <Field n={4} label="¿Dónde sentís mayor molestia?">
          <select className="input max-w-xs" value={zona} onChange={(e) => setZona(e.target.value as PainZone)}>
            {PAIN_ZONES.map((z) => (<option key={z} value={z}>{z}</option>))}
          </select>
        </Field>
        <Field n={5} label="¿Qué tan fatigado te sentís hoy?">
          <ChipScale min={0} max={10} value={fatiga} onChange={setFatiga} lowLabel="0 · fresco" highLabel="10 · agotado" />
        </Field>
        <Field n={6} label="¿Cómo fue tu descanso la última noche?" hint="Calidad del sueño">
          <SleepScale value={sueno} onChange={setSueno} />
        </Field>
        <Field n={7} label="¿Qué nivel de estrés o cansancio mental sentís hoy?">
          <ChipScale min={0} max={10} value={estres} onChange={setEstres} lowLabel="0 · nada" highLabel="10 · muchísimo" />
        </Field>

        {error && <p className="mt-4 text-sm font-medium text-[#b91c1c]">{error}</p>}

        <button onClick={submit} disabled={loading} className="btn btn-primary btn-lg mt-6 w-full disabled:opacity-60 sm:w-auto">
          {loading ? "Guardando…" : "Guardar control diario"}
        </button>
      </div>
    </div>
  );
}
