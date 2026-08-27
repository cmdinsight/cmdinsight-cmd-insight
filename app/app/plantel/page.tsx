import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { listRosterWithRisk } from "@/lib/data/deportistas";
import { TeamDashboard } from "@/components/roster/TeamDashboard";
import { teamWeeklyLoad, emergentes, latestDate } from "@/lib/roster";

export const dynamic = "force-dynamic";

export default async function PlantelPage({
  searchParams,
}: {
  searchParams: { org?: string; grupo?: string };
}) {
  const session = await requireRole("ENTRENADOR", "MEDICO", "ADMIN_ORG", "ADMIN_CMD");

  const orgId = session.rol === "ADMIN_CMD" ? searchParams.org ?? null : session.orgId;

  if (!orgId) {
    const orgs = await prisma.organizacion.findMany({ orderBy: { nombre: "asc" } });
    return (
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Plantel</h1>
        <p className="mt-2 text-sm text-slatey">Elegí una organización para ver su plantel.</p>
        <ul className="mt-4 grid gap-2">
          {orgs.map((o) => (
            <li key={o.id}>
              <Link href={`/app/plantel?org=${o.id}`} className="card block p-4 hover:shadow-pop">
                <span className="font-semibold text-ink">{o.nombre}</span>
                <span className="ml-2 text-xs text-slatey">{o.tipo}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const org = await prisma.organizacion.findUnique({ where: { id: orgId } });
  const roster = await listRosterWithRisk(orgId, searchParams.grupo ?? null);
  const asOf = latestDate(roster, new Date().toISOString().slice(0, 10));

  return (
    <TeamDashboard
      title={org?.nombre ?? "Plantel"}
      asOfLabel={roster.length ? `Estado al ${asOf}` : "Sin datos todavía"}
      linkBase="/app/plantel"
      players={roster}
      weeklyLoad={teamWeeklyLoad(roster, asOf)}
      emergentes={emergentes(roster, asOf)}
    />
  );
}
