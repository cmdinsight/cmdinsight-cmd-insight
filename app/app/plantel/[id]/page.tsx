import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getDeportistaFull } from "@/lib/data/deportistas";
import { RiskBadge } from "@/components/risk/RiskBadge";
import { PlayerInsight } from "@/components/demo/PlayerInsight";
import { FichaMedicaPanel } from "@/components/app/FichaMedicaPanel";
import { RegistrarEvento } from "@/components/app/RegistrarEvento";

export const dynamic = "force-dynamic";

export default async function PlantelPlayerPage({ params }: { params: { id: string } }) {
  const session = await requireRole("ENTRENADOR", "MEDICO", "ADMIN_ORG", "ADMIN_CMD");
  const d = await getDeportistaFull(params.id);
  if (!d) notFound();
  if (session.rol !== "ADMIN_CMD" && d.organizacionId !== session.orgId) notFound();

  const esMedico = session.rol === "MEDICO" || session.rol === "ADMIN_CMD";

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href={session.rol === "ADMIN_CMD" ? `/app/plantel?org=${d.organizacionId}` : "/app/plantel"}
        className="text-sm text-slatey hover:underline"
      >
        ← Volver al plantel
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">{d.nombre}</h1>
          <p className="text-sm text-slatey">
            {d.dorsal != null ? `#${d.dorsal} · ` : ""}
            {d.posicion || "—"}
            {d.grupo ? ` · ${d.grupo.nombre}` : ""}
          </p>
        </div>
        <RiskBadge score={d.risk.score} trend={d.risk.trend} />
      </div>

      <div className="mt-6">
        <PlayerInsight
          dailyLogs={d.dailyLogs}
          events={d.events}
          weekly={d.weekly}
          perfil={d.perfil}
          medico={esMedico}
          conducta
        />
      </div>

      {esMedico && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <FichaMedicaPanel deportistaId={d.id} ficha={d.fichaMedica} />
          <RegistrarEvento deportistaId={d.id} perfil={d.perfil} />
        </div>
      )}
    </div>
  );
}
