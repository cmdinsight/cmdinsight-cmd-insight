"use client";

import { useState } from "react";

export function useSubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function run(
    url: string,
    opts: { method: string; body?: unknown },
    onDone?: (data: any) => void,
  ) {
    setLoading(true);
    setError(null);
    setOk(null);
    try {
      const res = await fetch(url, {
        method: opts.method,
        headers: { "Content-Type": "application/json" },
        body: opts.body != null ? JSON.stringify(opts.body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "No se pudo completar la operación.");
        return;
      }
      onDone?.(data);
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, ok, setOk, setError, run };
}

export function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

export function FormMsg({ error, ok }: { error?: string | null; ok?: string | null }) {
  if (error) return <p className="text-sm font-medium text-[#b91c1c]">{error}</p>;
  if (ok) return <p className="text-sm font-medium text-teal-deep">{ok}</p>;
  return null;
}
