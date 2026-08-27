"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSubmit } from "./forms-shared";

export function SeedDemoButton() {
  const router = useRouter();
  const { loading, error, run } = useSubmit();
  const [result, setResult] = useState<any>(null);

  return (
    <div className="card p-5">
      <div className="font-display text-sm font-bold text-ink">Datos de demostración</div>
      <p className="mt-1 text-sm text-slatey">
        Crea la organización &ldquo;Club Demo CMD&rdquo; con 14 deportistas ficticios, 35 días de
        historial y cuentas de prueba (entrenador, médico, admin y deportista).
      </p>
      {error && <p className="mt-2 text-sm font-medium text-[#b91c1c]">{error}</p>}
      {result ? (
        <div className="mt-3 rounded-lg border border-line bg-mist p-3 text-xs text-slatey">
          <div className="font-semibold text-ink">Datos demo creados.</div>
          <div className="mt-1">Contraseña de todas las cuentas: <b>{result.cuentas?.password}</b></div>
          <ul className="mt-1 space-y-0.5">
            <li>Entrenador: {result.cuentas?.entrenador}</li>
            <li>Médico: {result.cuentas?.medico}</li>
            <li>Admin org: {result.cuentas?.adminOrg}</li>
            <li>Deportista: {result.cuentas?.deportista}</li>
          </ul>
        </div>
      ) : (
        <button
          disabled={loading}
          className="btn btn-ghost mt-3 disabled:opacity-60"
          onClick={() =>
            run("/api/seed-demo", { method: "POST", body: {} }, (data) => {
              setResult(data);
              router.refresh();
            })
          }
        >
          {loading ? "Creando… (puede tardar unos segundos)" : "Cargar datos demo"}
        </button>
      )}
    </div>
  );
}
