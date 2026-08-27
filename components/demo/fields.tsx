"use client";

import type { ReactNode } from "react";

export function Field({
  n,
  label,
  hint,
  children,
}: {
  n?: number;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-line py-6 first:border-t-0 first:pt-0">
      <div className="font-display text-base font-bold text-ink">
        {n != null && <span className="text-teal">{n}. </span>}
        {label}
      </div>
      {hint && <p className="mt-1 text-sm text-slatey">{hint}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function ChipScale({
  min,
  max,
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  min: number;
  max: number;
  value: number | null;
  onChange: (n: number) => void;
  lowLabel?: string;
  highLabel?: string;
}) {
  const opts = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {opts.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            aria-pressed={value === o}
            className={`h-11 min-w-[2.75rem] rounded-xl border px-3 text-sm font-bold transition-colors ${
              value === o
                ? "border-navy bg-navy text-white"
                : "border-line bg-white text-ink hover:border-navy/40"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      {(lowLabel || highLabel) && (
        <div className="mt-2 flex justify-between text-xs text-slatey">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      )}
    </div>
  );
}

const SLEEP = [
  { v: 1, t: "Muy malo" },
  { v: 2, t: "Malo" },
  { v: 3, t: "Regular" },
  { v: 4, t: "Bueno" },
  { v: 5, t: "Excelente" },
];

export function SleepScale({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (n: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {SLEEP.map((s) => (
        <button
          key={s.v}
          type="button"
          onClick={() => onChange(s.v)}
          aria-pressed={value === s.v}
          className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
            value === s.v
              ? "border-navy bg-navy text-white"
              : "border-line bg-white text-ink hover:border-navy/40"
          }`}
        >
          <span className="block text-xs opacity-70">{s.v}</span>
          {s.t}
        </button>
      ))}
    </div>
  );
}

export function YesNo({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (b: boolean) => void;
}) {
  return (
    <div className="flex gap-2">
      {[
        { b: true, t: "Sí" },
        { b: false, t: "No" },
      ].map((o) => (
        <button
          key={o.t}
          type="button"
          onClick={() => onChange(o.b)}
          aria-pressed={value === o.b}
          className={`h-11 flex-1 rounded-xl border text-sm font-bold transition-colors sm:flex-none sm:px-8 ${
            value === o.b
              ? "border-navy bg-navy text-white"
              : "border-line bg-white text-ink hover:border-navy/40"
          }`}
        >
          {o.t}
        </button>
      ))}
    </div>
  );
}

export function MultiChips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T[];
  onChange: (v: T[]) => void;
}) {
  const toggle = (o: T) =>
    onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => toggle(o)}
          aria-pressed={value.includes(o)}
          className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
            value.includes(o)
              ? "border-navy bg-navy text-white"
              : "border-line bg-white text-ink hover:border-navy/40"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
