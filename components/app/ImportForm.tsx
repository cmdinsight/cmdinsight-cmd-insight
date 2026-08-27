"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSubmit, FormMsg } from "./forms-shared";

export function ImportForm({ orgId }: { orgId?: string }) {
  const router = useRouter();
  const { loading, error, run } = useSubmit();
  const [csv, setCsv] = useState("");
  const [resumen, setResumen] = useState<string | null>(null);

  return (
    <div className="card max-w-2xl p-6">
      <p className="text-sm text-slatey">
        Pegá una fila por deportista, columnas separadas por coma:{" "}
        <code className="rounded bg-mist px-1">nombre, posición, dorsal, grupo</code>. La primera
        línea puede ser el encabezado. Los grupos que no existan se crean solos.
      </p>
      <textarea
        className="input mt-4 font-mono text-sm"
        rows={10}
        placeholder={"Juan Pérez, Volante, 8, Primera\nMartín Gómez, Defensa, 4, Primera"}
        value={csv}
        onChange={(e) => setCsv(e.target.value)}
      />
      <FormMsg error={error} />
      {resumen && <p className="mt-2 text-sm font-medium text-teal-deep">{resumen}</p>}
      <button
        disabled={loading || !csv.trim()}
        className="btn btn-primary mt-4 disabled:opacity-60"
        onClick={() =>
          run(
            "/api/import/deportistas",
            { method: "POST", body: { csv, organizacionId: orgId } },
            (data) => {
              setResumen(
                `${data.creados} deportistas creados.` +
                  (data.errores?.length ? ` ${data.errores.length} filas con problemas.` : ""),
              );
              setCsv("");
              router.refresh();
            },
          )
        }
      >
        {loading ? "Importando…" : "Importar"}
      </button>
    </div>
  );
}
