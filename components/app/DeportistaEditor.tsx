"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSubmit, Row, FormMsg } from "./forms-shared";

interface D {
  id: string;
  nombre: string;
  posicion: string | null;
  dorsal: number | null;
  grupoId: string | null;
  activo: boolean;
  organizacionId: string;
}

export function DeportistaEditor({
  d,
  grupos,
}: {
  d: D;
  grupos: { id: string; nombre: string }[];
}) {
  const router = useRouter();
  const { loading, error, ok, setOk, run } = useSubmit();
  const [nombre, setNombre] = useState(d.nombre);
  const [posicion, setPosicion] = useState(d.posicion ?? "");
  const [dorsal, setDorsal] = useState(d.dorsal?.toString() ?? "");
  const [grupoId, setGrupoId] = useState(d.grupoId ?? "");

  const save = () =>
    run(
      `/api/deportistas/${d.id}`,
      {
        method: "PATCH",
        body: {
          nombre,
          posicion: posicion || null,
          dorsal: dorsal ? Number(dorsal) : null,
          grupoId: grupoId || null,
          organizacionId: d.organizacionId,
        },
      },
      () => {
        setOk("Guardado.");
        router.refresh();
      },
    );

  const baja = () => {
    if (!confirm(`¿Dar de baja a ${d.nombre}? No se borran sus datos, deja de aparecer en el plantel.`)) return;
    run(`/api/deportistas/${d.id}?org=${d.organizacionId}`, { method: "DELETE" }, () => {
      router.push("/app/organizacion/deportistas");
      router.refresh();
    });
  };

  return (
    <div className="card max-w-lg p-6">
      <div className="space-y-4">
        <Row label="Nombre">
          <input className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </Row>
        <Row label="Posición / rol">
          <input className="input" value={posicion} onChange={(e) => setPosicion(e.target.value)} />
        </Row>
        <Row label="Dorsal">
          <input className="input max-w-[120px]" type="number" value={dorsal} onChange={(e) => setDorsal(e.target.value)} />
        </Row>
        {grupos.length > 0 && (
          <Row label="Grupo / categoría">
            <select className="input max-w-xs" value={grupoId} onChange={(e) => setGrupoId(e.target.value)}>
              <option value="">— Sin grupo —</option>
              {grupos.map((g) => (
                <option key={g.id} value={g.id}>{g.nombre}</option>
              ))}
            </select>
          </Row>
        )}
        <FormMsg error={error} ok={ok} />
        <div className="flex flex-wrap gap-3">
          <button disabled={loading} onClick={save} className="btn btn-primary disabled:opacity-60">
            Guardar cambios
          </button>
          {d.activo && (
            <button disabled={loading} onClick={baja} className="btn btn-ghost">
              Dar de baja
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
