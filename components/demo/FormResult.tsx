"use client";

import Link from "next/link";
import { SemaphorePanel } from "@/components/risk/Semaphore";
import { CalibracionAviso } from "@/components/risk/CalibracionAviso";
import type { RiskResult } from "@/lib/score/engine";

export function FormResult({
  risk,
  title,
  backHref = "/demo/deportista",
  evolucionHref = "/demo/deportista/mi-score",
  tono = "tecnico",
}: {
  risk: Pick<RiskResult, "score" | "breakdown" | "alerts"> & Partial<Pick<RiskResult, "calibracion">>;
  title: string;
  backHref?: string;
  evolucionHref?: string;
  tono?: "tecnico" | "simple";
}) {
  const calibrando = !!risk.calibracion?.activa;
  return (
    <div className="mx-auto max-w-2xl">
      <div className="eyebrow">Listo</div>
      <h1 className="mt-1 font-display text-2xl font-extrabold text-ink">{title}</h1>
      <p className="mt-1 text-sm text-slatey">
        Guardado. Así queda tu score de riesgo con esta información:
      </p>

      {risk.calibracion?.activa && (
        <div className="mt-6">
          <CalibracionAviso calibracion={risk.calibracion} tono={tono} />
        </div>
      )}

      <div className="mt-6">
        <SemaphorePanel score={risk.score} breakdown={risk.breakdown} tono={tono} calibrando={calibrando} />
      </div>

      {risk.alerts.length > 0 && (
        <div className="mt-4 rounded-xl border border-line bg-white p-4">
          <div className="text-sm font-semibold text-ink">Alertas activas</div>
          <ul className="mt-2 space-y-1 text-sm text-slatey">
            {risk.alerts.map((a) => (
              <li key={a.key} className="flex items-center gap-2">
                <span
                  className={`risk-dot risk-${a.severity === "high" ? "high" : "mod"}`}
                  style={{ background: "currentColor" }}
                />
                {a.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={backHref} className="btn btn-primary">
          Volver a mis formularios
        </Link>
        <Link href={evolucionHref} className="btn btn-ghost">
          Ver mi evolución
        </Link>
      </div>
    </div>
  );
}
