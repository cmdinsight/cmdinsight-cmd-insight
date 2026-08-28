"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlayerInsight } from "@/components/demo/PlayerInsight";
import { effectiveAthleteData } from "@/components/demo/store";
import type { DailyLog, PerfilDeportista, SpecialEvent, WeeklyLog } from "@/lib/score/types";

export default function MiScorePage() {
  const [data, setData] = useState<{
    dailyLogs: DailyLog[];
    events: SpecialEvent[];
    weekly: WeeklyLog | null;
    perfil: PerfilDeportista;
  } | null>(null);

  useEffect(() => {
    setData(effectiveAthleteData());
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="eyebrow">Deportista</div>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-ink">Mi score y evolución</h1>
        </div>
        <Link href="/demo/deportista" className="btn btn-ghost">
          Volver
        </Link>
      </div>

      <p className="mt-2 text-sm text-slatey">
        Este es el mismo cálculo que ve tu cuerpo técnico. Cuanto más completás los formularios,
        más preciso es.
      </p>

      <div className="mt-6">
        {data ? (
          <PlayerInsight dailyLogs={data.dailyLogs} events={data.events} weekly={data.weekly} perfil={data.perfil} tono="simple" conducta />
        ) : (
          <div className="card p-8 text-sm text-slatey">Cargando tus datos…</div>
        )}
      </div>
    </div>
  );
}
