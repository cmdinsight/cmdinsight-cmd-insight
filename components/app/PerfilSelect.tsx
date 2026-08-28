"use client";

import { PERFIL_OPCIONES, getPerfil } from "@/lib/score/perfiles";

export function PerfilSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <select className="input max-w-xs" value={value} onChange={(e) => onChange(e.target.value)}>
        {PERFIL_OPCIONES.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>
      <p className="mt-1 text-xs text-slatey">{getPerfil(value).descripcion}</p>
    </div>
  );
}
