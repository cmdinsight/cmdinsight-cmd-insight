"use client";

import { useEffect, useState } from "react";
import type { PainZone, PerfilDeportista, TipoDolor } from "@/lib/score/types";
import { getPerfil } from "@/lib/score/perfiles";
import { computeRisk, type RiskResult } from "@/lib/score/engine";
import { Field, ChipScale, SleepScale, YesNo } from "@/components/demo/fields";
import { addDaily, effectiveAthleteData, loadPerfil, todayISO } from "@/components/demo/store";
import { FormResult } from "@/components/demo/FormResult";

export default function ControlDiarioPage() {
  const [perfil, setPerfilState] = useState<PerfilDeportista | null>(null);
  const [rpe, setRpe] = useState<number | null>(null);
  const [minutes, setMinutes] = useState<string>("");
  const [km, setKm] = useState<string>("");
  const [dolor, setDolor] = useState<number | null>(null);
  const [zona, setZona] = useState<PainZone>("Ninguna");
  const [tipoDolor, setTipoDolor] = useState<TipoDolor | null>(null);
  const [entrenoAlFallo, setEntrenoAlFallo] = useState<boolean | null>(null);
  const [fatiga, setFatiga] = useState<number | null>(null);
  const [sueno, setSueno] = useState<number | null>(null);
  const [estres, setEstres] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RiskResult | null>(null);

  useEffect(() => {
    setPerfilState(loadPerfil());
  }, []);

  if (result) return <FormResult risk={result} title="Control diario cargado" />;
  if (!perfil) return <div className="card p-8 text-sm text-slatey">Cargando el formulario…</div>;

  const cfg = getPerfil(perfil);
  const conDolor = (dolor ?? 0) >= 1;
  let n = 0;

  const submit = () => {
    const mins = Number(minutes);
    if (
      rpe == null ||
      dolor == null ||
      fatiga == null ||
      sueno == null ||
      estres == null ||
      !minutes ||
      Number.isNaN(mins) ||
      mins <= 0
    ) {
      setError("Completá todas las escalas y la duración del entrenamiento.");
      return;
    }
    if (cfg.campos.tipoDolor && conDolor && tipoDolor == null) {
      setError("Indicá si el dolor es muscular o articular.");
      return;
    }
    if (cfg.campos.entrenoAlFallo && entrenoAlFallo == null) {
      setError("Indicá si entrenaste al fallo.");
      return;
    }
    addDaily({
      date: todayISO(),
      rpe,
      minutes: Math.round(mins),
      dolor,
      zona: conDolor ? zona : "Ninguna",
      fatiga,
      sueno,
      estres,
      km: cfg.campos.km && km ? Number(km) : undefined,
      tipoDolor: cfg.campos.tipoDolor && conDolor ? (tipoDolor ?? undefined) : undefined,
      entrenoAlFallo: cfg.campos.entrenoAlFallo ? (entrenoAlFallo ?? undefined) : undefined,
    });
    const { dailyLogs, weekly, events, perfil: pf } = effectiveAthleteData();
    setResult(computeRisk({ dailyLogs, events, weekly, perfil: pf }));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="eyebrow">Formulario 1 · después de cada entrenamiento o sesión</div>
      <h1 className="mt-1 font-display text-2xl font-extrabold text-ink">
        Control diario de carga y bienestar
      </h1>
      <p className="mt-2 text-sm text-slatey">
        Este formulario nos ayuda a cuidar tu salud y prevenir lesiones. Completalo con sinceridad.
        No lleva más de 2 minutos. Perfil:{" "}
        <span className="font-semibold text-ink">{cfg.label}</span>.
      </p>

      <div className="card mt-6 p-5 sm:p-7">
        <Field n={++n} label={cfg.preguntaCarga} hint="Carga percibida (RPE)">
          <ChipScale min={0} max={10} value={rpe} onChange={setRpe} lowLabel="0 · descanso" highLabel="10 · extremadamente exigente" />
        </Field>

        <Field n={++n} label="¿Cuántos minutos duró?">
          <input className="input max-w-[160px]" type="number" inputMode="numeric" min={1} placeholder="60" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
        </Field>

        {cfg.campos.km && (
          <Field n={++n} label="¿Cuántos kilómetros hiciste hoy?" hint="Dejá vacío si hoy no corriste / pedaleaste">
            <input className="input max-w-[160px]" type="number" inputMode="decimal" step="0.1" min={0} placeholder="10" value={km} onChange={(e) => setKm(e.target.value)} />
          </Field>
        )}

        {cfg.campos.entrenoAlFallo && (
          <Field n={++n} label="¿Entrenaste al fallo muscular en alguna serie?">
            <YesNo value={entrenoAlFallo} onChange={setEntrenoAlFallo} />
          </Field>
        )}

        <Field n={++n} label="¿Tenés dolor muscular o articular en este momento?">
          <ChipScale min={0} max={10} value={dolor} onChange={setDolor} lowLabel="0 · sin dolor" highLabel="10 · dolor muy intenso" />
        </Field>

        {conDolor && (
          <Field n={++n} label="¿Dónde sentís mayor molestia?">
            <select className="input max-w-xs" value={zona} onChange={(e) => setZona(e.target.value as PainZone)}>
              {cfg.zonas.map((z) => (<option key={z} value={z}>{z}</option>))}
            </select>
          </Field>
        )}

        {cfg.campos.tipoDolor && conDolor && (
          <Field n={++n} label="¿Ese dolor es muscular o articular?" hint="El dolor muscular tipo agujetas es esperable; el articular o de tendón es una señal a vigilar">
            <div className="flex gap-2">
              {[
                { v: "muscular" as TipoDolor, t: "Muscular (agujetas)" },
                { v: "articular" as TipoDolor, t: "Articular / tendón" },
              ].map((o) => (
                <button
                  key={o.v}
                  type="button"
                  onClick={() => setTipoDolor(o.v)}
                  aria-pressed={tipoDolor === o.v}
                  className={`h-11 flex-1 rounded-xl border px-3 text-sm font-bold transition-colors ${
                    tipoDolor === o.v ? "border-navy bg-navy text-white" : "border-line bg-white text-ink hover:border-navy/40"
                  }`}
                >
                  {o.t}
                </button>
              ))}
            </div>
          </Field>
        )}

        <Field n={++n} label="¿Qué tan fatigado te sentís hoy?">
          <ChipScale min={0} max={10} value={fatiga} onChange={setFatiga} lowLabel="0 · fresco" highLabel="10 · agotado" />
        </Field>
        <Field n={++n} label="¿Cómo fue tu descanso la última noche?" hint="Calidad del sueño">
          <SleepScale value={sueno} onChange={setSueno} />
        </Field>
        <Field n={++n} label="¿Qué nivel de estrés o cansancio mental sentís hoy?">
          <ChipScale min={0} max={10} value={estres} onChange={setEstres} lowLabel="0 · nada" highLabel="10 · muchísimo" />
        </Field>

        {error && <p className="mt-4 text-sm font-medium text-[#b91c1c]">{error}</p>}

        <button onClick={submit} className="btn btn-primary btn-lg mt-6 w-full sm:w-auto">
          Guardar control diario
        </button>
      </div>
    </div>
  );
}
