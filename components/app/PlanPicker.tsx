"use client";

import { PLAN_LABEL, PLAN_DESC } from "@/lib/planes";

// Selector de plan como tarjetas: nombre + descripción en letra chica.
// Reemplaza el <select> con códigos crudos (CLUB_MENSUAL, etc.).
export function PlanPicker({
  value,
  onChange,
  planes,
}: {
  value: string;
  onChange: (p: string) => void;
  planes: string[];
}) {
  return (
    <div className="grid gap-2">
      {planes.map((p) => {
        const active = value === p;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-pressed={active}
            className={`rounded-xl border p-3 text-left transition-colors ${
              active ? "border-navy bg-navy/[0.04]" : "border-line bg-white hover:border-navy/40"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`h-3.5 w-3.5 flex-none rounded-full border-2 ${
                  active ? "border-navy bg-navy" : "border-line"
                }`}
              />
              <span className="font-semibold text-ink">{PLAN_LABEL[p] ?? p}</span>
            </div>
            <p className="mt-1 pl-[1.375rem] text-xs leading-snug text-slatey">{PLAN_DESC[p] ?? ""}</p>
          </button>
        );
      })}
    </div>
  );
}
