"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSubmit, Row, FormMsg } from "./forms-shared";
import { PlanPicker } from "./PlanPicker";
import { planesParaTipo } from "@/lib/planes";

interface Org {
  id: string;
  nombre: string;
  tipo?: string | null;
  plan: string;
  cmdCubierta: boolean;
  trialHasta: string | Date | null;
  notas: string | null;
}

export function OrgEditor({ org }: { org: Org }) {
  const router = useRouter();
  const { loading, error, ok, setOk, run } = useSubmit();
  const [nombre, setNombre] = useState(org.nombre);
  const [plan, setPlan] = useState(org.plan);
  const [cmdCubierta, setCmdCubierta] = useState(org.cmdCubierta);
  const [trialHasta, setTrialHasta] = useState(
    org.trialHasta ? new Date(org.trialHasta).toISOString().slice(0, 10) : "",
  );
  const [notas, setNotas] = useState(org.notas ?? "");

  // Siempre mostrar el plan actual, aunque no sea "típico" para el tipo de organización.
  const planesBase = planesParaTipo(org.tipo);
  const planes = planesBase.includes(org.plan) ? planesBase : [org.plan, ...planesBase];

  return (
    <div className="card max-w-lg p-6">
      <div className="space-y-4">
        <Row label="Nombre">
          <input className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </Row>
        <Row label="Plan">
          <PlanPicker value={plan} onChange={setPlan} planes={planes} />
        </Row>
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" className="h-4 w-4" checked={cmdCubierta} onChange={(e) => setCmdCubierta(e.target.checked)} />
          Cubierta por CMD en cancha
        </label>
        <Row label="Trial hasta">
          <input type="date" className="input max-w-[200px]" value={trialHasta} onChange={(e) => setTrialHasta(e.target.value)} />
        </Row>
        <Row label="Notas">
          <textarea className="input" rows={2} value={notas} onChange={(e) => setNotas(e.target.value)} />
        </Row>
        <FormMsg error={error} ok={ok} />
        <button
          disabled={loading}
          className="btn btn-primary disabled:opacity-60"
          onClick={() =>
            run(
              `/api/organizaciones/${org.id}`,
              {
                method: "PATCH",
                body: { nombre, plan, cmdCubierta, trialHasta: trialHasta || null, notas },
              },
              () => {
                setOk("Guardado.");
                router.refresh();
              },
            )
          }
        >
          {loading ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </div>
  );
}
