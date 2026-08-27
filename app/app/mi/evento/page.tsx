"use client";

import { useState } from "react";
import { SPECIAL_EVENT_TYPES, type SpecialEventType } from "@/lib/score/types";
import { Field, MultiChips } from "@/components/demo/fields";
import { FormResult } from "@/components/demo/FormResult";
import { FormConfirmacion } from "@/components/app/FormConfirmacion";

export default function EventoPage() {
  const [tipos, setTipos] = useState<SpecialEventType[]>([]);
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (result) {
    return result.mostrarRiesgo && result.risk ? (
      <FormResult risk={result.risk} title="Evento especial registrado" backHref="/app/mi" evolucionHref="/app/mi/evolucion" />
    ) : (
      <FormConfirmacion titulo="Evento especial registrado" />
    );
  }

  const submit = async () => {
    if (tipos.length === 0) {
      setError("Marcá al menos un evento.");
      return;
    }
    setError(null);
    setLoading(true);
    const res = await fetch("/api/eventos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: new Date().toISOString().slice(0, 10),
        tipos,
        comentario: comentario.trim() || null,
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
      <div className="eyebrow">Formulario 3 · solo si ocurre algo puntual</div>
      <h1 className="mt-1 font-display text-2xl font-extrabold text-ink">Evento o molestia especial</h1>
      <p className="mt-2 text-sm text-slatey">
        Si pasó algo hoy —un golpe, un tirón, calambres— registralo en el momento.
      </p>

      <div className="card mt-6 p-5 sm:p-7">
        <Field label="¿Ocurrió alguno de estos eventos?" hint="Podés marcar más de uno">
          <MultiChips options={SPECIAL_EVENT_TYPES} value={tipos} onChange={setTipos} />
        </Field>
        <Field label="Comentario breve (opcional)">
          <textarea className="input" rows={3} placeholder="Contá qué pasó, dónde y en qué momento del entrenamiento." value={comentario} onChange={(e) => setComentario(e.target.value)} />
        </Field>

        {error && <p className="mt-4 text-sm font-medium text-[#b91c1c]">{error}</p>}

        <button onClick={submit} disabled={loading} className="btn btn-primary btn-lg mt-6 w-full disabled:opacity-60 sm:w-auto">
          {loading ? "Guardando…" : "Registrar evento"}
        </button>
      </div>
    </div>
  );
}
