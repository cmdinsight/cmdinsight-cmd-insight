"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSubmit, Row, FormMsg } from "./forms-shared";
import type { Rol } from "@/lib/roles";

export function UsuarioForm({
  roles,
  deportistasSinUsuario,
  orgId,
}: {
  roles: { value: Rol; label: string }[];
  deportistasSinUsuario: { id: string; nombre: string }[];
  orgId?: string;
}) {
  const router = useRouter();
  const { loading, error, ok, setOk, run } = useSubmit();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<Rol>(roles[0]?.value ?? "ENTRENADOR");
  const [deportistaId, setDeportistaId] = useState("");

  return (
    <div className="card max-w-lg p-6">
      <div className="space-y-4">
        <Row label="Nombre">
          <input className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </Row>
        <Row label="Email">
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Row>
        <Row label="Contraseña (mínimo 8)">
          <input className="input" type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Row>
        <Row label="Rol">
          <select className="input max-w-xs" value={rol} onChange={(e) => setRol(e.target.value as Rol)}>
            {roles.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </Row>
        {rol === "DEPORTISTA" && (
          <Row label="Vincular a deportista">
            <select className="input max-w-xs" value={deportistaId} onChange={(e) => setDeportistaId(e.target.value)}>
              <option value="">— Elegir —</option>
              {deportistasSinUsuario.map((d) => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
          </Row>
        )}
        <FormMsg error={error} ok={ok} />
        <button
          disabled={loading}
          className="btn btn-primary disabled:opacity-60"
          onClick={() =>
            run(
              "/api/usuarios",
              {
                method: "POST",
                body: { nombre, email, password, rol, deportistaId: deportistaId || null, organizacionId: orgId },
              },
              () => {
                setOk("Usuario creado.");
                setNombre("");
                setEmail("");
                setPassword("");
                setDeportistaId("");
                router.refresh();
              },
            )
          }
        >
          {loading ? "Creando…" : "Crear usuario"}
        </button>
      </div>
    </div>
  );
}
