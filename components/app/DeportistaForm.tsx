"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSubmit, Row, FormMsg } from "./forms-shared";
import { PerfilSelect } from "./PerfilSelect";

export function DeportistaForm({
  grupos,
  orgId,
  perfilPorDefecto = "EQUIPO",
}: {
  grupos: { id: string; nombre: string }[];
  orgId?: string;
  perfilPorDefecto?: string;
}) {
  const router = useRouter();
  const { loading, error, run } = useSubmit();
  const [nombre, setNombre] = useState("");
  const [posicion, setPosicion] = useState("");
  const [dorsal, setDorsal] = useState("");
  const [grupoId, setGrupoId] = useState("");
  const [perfil, setPerfil] = useState(perfilPorDefecto);

  return (
    <div className="card max-w-lg p-6">
      <div className="space-y-4">
        <Row label="Nombre">
          <input className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </Row>
        <Row label="Posición / rol (opcional)">
          <input className="input" value={posicion} onChange={(e) => setPosicion(e.target.value)} />
        </Row>
        <Row label="Dorsal (opcional)">
          <input className="input max-w-[120px]" type="number" value={dorsal} onChange={(e) => setDorsal(e.target.value)} />
        </Row>
        {grupos.length > 0 && (
          <Row label="Grupo / categoría (opcional)">
            <select className="input max-w-xs" value={grupoId} onChange={(e) => setGrupoId(e.target.value)}>
              <option value="">— Sin grupo —</option>
              {grupos.map((g) => (
                <option key={g.id} value={g.id}>{g.nombre}</option>
              ))}
            </select>
          </Row>
        )}
        <Row label="Perfil de deportista">
          <PerfilSelect value={perfil} onChange={setPerfil} />
        </Row>
        <FormMsg error={error} />
        <button
          disabled={loading}
          className="btn btn-primary disabled:opacity-60"
          onClick={() =>
            run(
              "/api/deportistas",
              {
                method: "POST",
                body: {
                  nombre,
                  posicion: posicion || null,
                  dorsal: dorsal ? Number(dorsal) : null,
                  grupoId: grupoId || null,
                  perfil,
                  organizacionId: orgId,
                },
              },
              () => {
                router.push(orgId ? `/app/organizacion/deportistas?org=${orgId}` : "/app/organizacion/deportistas");
                router.refresh();
              },
            )
          }
        >
          {loading ? "Creando…" : "Crear deportista"}
        </button>
      </div>
    </div>
  );
}
