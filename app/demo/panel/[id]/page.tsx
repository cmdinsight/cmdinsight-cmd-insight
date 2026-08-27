import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlayer, getRoster } from "@/lib/demo/data";
import { RiskBadge } from "@/components/risk/RiskBadge";
import { PlayerInsight } from "@/components/demo/PlayerInsight";

export function generateStaticParams() {
  return getRoster().map((p) => ({ id: p.id }));
}

export default function PlayerPage({ params }: { params: { id: string } }) {
  const player = getPlayer(params.id);
  if (!player) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/demo/panel" className="text-sm text-slatey hover:underline">
        ← Volver al plantel
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">{player.nombre}</h1>
          <p className="text-sm text-slatey">
            #{player.dorsal} · {player.posicion} · {player.categoria}
          </p>
        </div>
        <RiskBadge score={player.risk.score} trend={player.risk.trend} />
      </div>

      <div className="mt-6">
        <PlayerInsight
          dailyLogs={player.dailyLogs}
          events={player.events}
          weekly={player.weekly}
          medico
        />
      </div>
    </div>
  );
}
