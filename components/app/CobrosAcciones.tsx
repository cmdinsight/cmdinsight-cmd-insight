"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSubmit, FormMsg } from "./forms-shared";

/** Botones del panel de Cobros: crear/vincular el plan y sincronizar. */
export function CobrosAcciones({ claves, tienePlan }: { claves: boolean; tienePlan: boolean }) {
  const router = useRouter();
  const { loading, error, ok, setOk, run } = useSubmit();
  const [planId, setPlanId] = useState("");

  if (!claves) {
    return (
      <p className="mt-3 text-sm text-slatey">
        Cuando las claves estén cargadas en Vercel (y se vuelva a publicar), acá aparecen los botones
        para crear el plan.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <FormMsg error={error} ok={ok} />
      <div className="flex flex-wrap gap-2">
        {!tienePlan && (
          <button
            disabled={loading}
            className="btn btn-accent disabled:opacity-60"
            onClick={() =>
              run("/api/cobros/plan", { method: "POST", body: { modo: "crear" } }, (d) => {
                setOk(`Plan creado en dLocal (n.º ${d.planId}).`);
                router.refresh();
              })
            }
          >
            Crear plan $160/mes en dLocal
          </button>
        )}
        {tienePlan && (
          <button
            disabled={loading}
            className="btn btn-primary disabled:opacity-60"
            onClick={() =>
              run("/api/cobros/sincronizar", { method: "POST" }, (d) => {
                setOk(
                  `Listo: ${d.suscripciones} suscripciones en dLocal, ${d.vinculadas} vinculadas.` +
                    (d.sinCuenta?.length ? ` Sin cuenta en CMD Insight: ${d.sinCuenta.join(", ")}.` : ""),
                );
                router.refresh();
              })
            }
          >
            {loading ? "Consultando dLocal…" : "Sincronizar ahora"}
          </button>
        )}
      </div>
      <details className="text-sm text-slatey">
        <summary className="cursor-pointer">
          {tienePlan ? "Cambiar de plan" : "Ya creé el plan en el panel de dLocal Go"}
        </summary>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            id="cobros-plan-id"
            className="input max-w-[12rem]"
            placeholder="N.º de plan"
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
          />
          <button
            disabled={loading || !planId.trim()}
            className="btn btn-ghost disabled:opacity-60"
            onClick={() =>
              run("/api/cobros/plan", { method: "POST", body: { planId } }, (d) => {
                setOk(`Plan n.º ${d.planId} vinculado.`);
                router.refresh();
              })
            }
          >
            Usar este plan
          </button>
        </div>
      </details>
    </div>
  );
}
