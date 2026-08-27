import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { listRosterWithRisk } from "@/lib/data/deportistas";
import { prisma } from "@/lib/prisma";
import { RiskBadge } from "@/components/risk/RiskBadge";

export const dynamic = "force-dynamic";

export default async function DeportistasPage() {
  const s = await requireRole("ADMIN_ORG", "ADMIN_CMD");
  if (!s.orgId) redirect("/app/cmd");

  const roster = await listRosterWithRisk(s.orgId);
  const bajas = await prisma.deportista.count({ where: { organizacionId: s.orgId, activo: false } });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-ink">Deportistas</h1>
        <div className="flex gap-2">
          <Link href="/app/organizacion/deportistas/importar" className="btn btn-ghost">Importar CSV</Link>
          <Link href="/app/organizacion/deportistas/nuevo" className="btn btn-primary">Nuevo</Link>
        </div>
      </div>

      {roster.length === 0 ? (
        <div className="card mt-6 p-8 text-sm text-slatey">
          Todavía no hay deportistas. Creá uno o importá el plantel por CSV.
        </div>
      ) : (
        <div className="card mt-6 overflow-hidden">
          <ul className="divide-y divide-line">
            {roster.map((d) => (
              <li key={d.id}>
                <Link href={`/app/organizacion/deportistas/${d.id}`} className="flex items-center justify-between p-4 hover:bg-mist">
                  <div>
                    <div className="font-semibold text-ink">{d.nombre}</div>
                    <div className="text-xs text-slatey">
                      {d.dorsal != null ? `#${d.dorsal} · ` : ""}
                      {d.posicion || d.grupo || "—"}
                    </div>
                  </div>
                  <RiskBadge score={d.risk.score} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {bajas > 0 && <p className="mt-4 text-xs text-slatey">{bajas} deportista(s) dados de baja.</p>}
    </div>
  );
}
