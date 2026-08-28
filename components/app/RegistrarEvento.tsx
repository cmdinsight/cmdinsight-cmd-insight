"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PerfilDeportista, SpecialEventType } from "@/lib/score/types";
import { getPerfil } from "@/lib/score/perfiles";
import { MultiChips } from "@/components/demo/fields";

export function RegistrarEvento({
  deportistaId,
  perfil = "EQUIPO",
}: {
  deportistaId: string;
  perfil?: PerfilDeportista;
}) {
  const router = useRouter();
  const eventos = getPerfil(perfil).eventos;
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [tipos, setTipos] = useState<SpecialEventType[]>([]);
  const [comentario, setComentario] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "ok" | "error">("idle");

  const save = async () => {
    if (tipos.length === 0) return;
    setState("saving");
    const res = await fetch("/api/eventos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deportistaId, fecha, tipos, comentario: comentario.trim() || null }),
    });
    if (res.ok) {
      setState("ok");
      setTipos([]);
      setComentario("");
      router.refresh();
    } else {
      setState("error");
    }
  };

  return (
    <div className="card p-5">
      <div className="font-display text-sm font-bold text-ink">Registrar evento clínico</div>
      <p className="mt-1 text-xs text-slatey">
        Un evento reciente suma al score de riesgo y aparece en las molestias emergentes del plantel.
      </p>
      <div className="mt-3 space-y-3">
        <div>
          <label className="label">Fecha</label>
          <input type="date" className="input max-w-[200px]" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </div>
        <div>
          <label className="label">Tipo de evento</label>
          <MultiChips options={eventos} value={tipos} onChange={setTipos} />
        </div>
        <div>
          <label className="label">Comentario</label>
          <textarea className="input" rows={2} value={comentario} onChange={(e) => setComentario(e.target.value)} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={save}
          disabled={state === "saving" || tipos.length === 0}
          className="btn btn-primary disabled:opacity-60"
        >
          {state === "saving" ? "Guardando…" : "Registrar evento"}
        </button>
        {state === "ok" && <span className="text-sm font-medium text-teal-deep">Registrado.</span>}
        {state === "error" && <span className="text-sm text-[#b91c1c]">No se pudo registrar.</span>}
      </div>
    </div>
  );
}
