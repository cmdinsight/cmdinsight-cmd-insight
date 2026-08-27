"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSubmit, Row, FormMsg } from "./forms-shared";

const TIPOS = [
  { v: "CLUB", t: "Club deportivo" },
  { v: "GIMNASIO", t: "Gimnasio" },
  { v: "INDIVIDUAL", t: "Deportista individual" },
];

const PLANES = [
  "TRIAL",
  "CORTESIA_CMD",
  "CLUB_MENSUAL",
  "GIMNASIO",
  "INDIVIDUAL",
  "INDIVIDUAL_PREMIUM",
];

export function OrgForm() {
  const router = useRouter();
  const { loading, error, run } = useSubmit();
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("CLUB");
  const [plan, setPlan] = useState("TRIAL");
  const [cmdCubierta, setCmdCubierta] = useState(false);
  const [adminNombre, setAdminNombre] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  return (
    <div className="card max-w-lg p-6">
      <div className="space-y-4">
        <Row label="Nombre de la organización">
          <input className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </Row>
        <Row label="Tipo">
          <select className="input max-w-xs" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {TIPOS.map((t) => (<option key={t.v} value={t.v}>{t.t}</option>))}
          </select>
        </Row>
        <Row label="Plan">
          <select className="input max-w-xs" value={plan} onChange={(e) => setPlan(e.target.value)}>
            {PLANES.map((p) => (<option key={p} value={p}>{p}</option>))}
          </select>
        </Row>
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" className="h-4 w-4" checked={cmdCubierta} onChange={(e) => setCmdCubierta(e.target.checked)} />
          Cubierta por CMD en cancha
        </label>

        <div className="hairline pt-4">
          <p className="mb-3 text-sm font-semibold text-ink">Administrador de la organización</p>
          <div className="space-y-3">
            <Row label="Nombre">
              <input className="input" value={adminNombre} onChange={(e) => setAdminNombre(e.target.value)} />
            </Row>
            <Row label="Email">
              <input className="input" type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
            </Row>
            <Row label="Contraseña (mínimo 8)">
              <input className="input" type="text" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
            </Row>
          </div>
        </div>

        <FormMsg error={error} />
        <button
          disabled={loading}
          className="btn btn-primary disabled:opacity-60"
          onClick={() =>
            run(
              "/api/organizaciones",
              { method: "POST", body: { nombre, tipo, plan, cmdCubierta, adminNombre, adminEmail, adminPassword } },
              (data) => {
                router.push(`/app/cmd/${data.organizacion.id}`);
                router.refresh();
              },
            )
          }
        >
          {loading ? "Creando…" : "Crear organización"}
        </button>
      </div>
    </div>
  );
}
