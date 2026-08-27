"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Ficha {
  antecedentes: string | null;
  lesionesPrevias: string | null;
  medicacion: string | null;
  chequeoPrecompFecha: Date | string | null;
  ecgInformado: boolean;
  ecgNotas: string | null;
}

export function FichaMedicaPanel({
  deportistaId,
  ficha,
}: {
  deportistaId: string;
  ficha: Ficha | null;
}) {
  const router = useRouter();
  const [antecedentes, setAntecedentes] = useState(ficha?.antecedentes ?? "");
  const [lesionesPrevias, setLesionesPrevias] = useState(ficha?.lesionesPrevias ?? "");
  const [medicacion, setMedicacion] = useState(ficha?.medicacion ?? "");
  const [chequeo, setChequeo] = useState(
    ficha?.chequeoPrecompFecha
      ? new Date(ficha.chequeoPrecompFecha).toISOString().slice(0, 10)
      : "",
  );
  const [ecgInformado, setEcgInformado] = useState(ficha?.ecgInformado ?? false);
  const [ecgNotas, setEcgNotas] = useState(ficha?.ecgNotas ?? "");
  const [state, setState] = useState<"idle" | "saving" | "ok" | "error">("idle");

  const save = async () => {
    setState("saving");
    const res = await fetch(`/api/deportistas/${deportistaId}/ficha`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        antecedentes,
        lesionesPrevias,
        medicacion,
        chequeoPrecompFecha: chequeo || null,
        ecgInformado,
        ecgNotas,
      }),
    });
    if (res.ok) {
      setState("ok");
      router.refresh();
    } else {
      setState("error");
    }
  };

  return (
    <div className="card p-5">
      <div className="font-display text-sm font-bold text-ink">Ficha médica</div>
      <div className="mt-3 space-y-3">
        <div>
          <label className="label">Antecedentes</label>
          <textarea className="input" rows={2} value={antecedentes} onChange={(e) => setAntecedentes(e.target.value)} />
        </div>
        <div>
          <label className="label">Lesiones previas</label>
          <textarea className="input" rows={2} value={lesionesPrevias} onChange={(e) => setLesionesPrevias(e.target.value)} />
        </div>
        <div>
          <label className="label">Medicación</label>
          <input className="input" value={medicacion} onChange={(e) => setMedicacion(e.target.value)} />
        </div>
        <div>
          <label className="label">Fecha de chequeo precompetitivo</label>
          <input type="date" className="input max-w-[200px]" value={chequeo} onChange={(e) => setChequeo(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" className="h-4 w-4" checked={ecgInformado} onChange={(e) => setEcgInformado(e.target.checked)} />
          ECG informado
        </label>
        <div>
          <label className="label">Notas de ECG</label>
          <textarea className="input" rows={2} value={ecgNotas} onChange={(e) => setEcgNotas(e.target.value)} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button onClick={save} disabled={state === "saving"} className="btn btn-primary disabled:opacity-60">
          {state === "saving" ? "Guardando…" : "Guardar ficha"}
        </button>
        {state === "ok" && <span className="text-sm font-medium text-teal-deep">Guardado.</span>}
        {state === "error" && <span className="text-sm text-[#b91c1c]">No se pudo guardar.</span>}
      </div>
    </div>
  );
}
