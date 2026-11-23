"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSubmit, FormMsg } from "./forms-shared";

/** Dar de baja el Plan Individual, con confirmación en la misma pantalla. */
export function CancelarSuscripcion() {
  const router = useRouter();
  const { loading, error, run } = useSubmit();
  const [confirmar, setConfirmar] = useState(false);

  if (!confirmar) {
    return (
      <button className="btn btn-ghost mt-4 w-full" onClick={() => setConfirmar(true)}>
        Dar de baja la suscripción
      </button>
    );
  }
  return (
    <div className="mt-4 rounded-lg border border-line bg-mist p-4 text-sm">
      <p className="text-ink">
        ¿Seguro? No se te va a cobrar más. Podés seguir usando CMD Insight hasta que termine el mes
        que ya pagaste.
      </p>
      <FormMsg error={error} />
      <div className="mt-3 flex gap-2">
        <button
          disabled={loading}
          className="btn btn-primary disabled:opacity-60"
          onClick={() => run("/api/cobros/cancelar", { method: "POST" }, () => router.refresh())}
        >
          {loading ? "Dando de baja…" : "Sí, dar de baja"}
        </button>
        <button className="btn btn-ghost" onClick={() => setConfirmar(false)}>
          No, volver
        </button>
      </div>
    </div>
  );
}
