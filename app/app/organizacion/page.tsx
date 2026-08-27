import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_LABEL } from "@/lib/planes";

export const dynamic = "force-dynamic";

export default async function OrganizacionPage() {
  const s = await requireRole("ADMIN_ORG", "ADMIN_CMD");
  if (!s.orgId) redirect("/app/cmd");

  const org = await prisma.organizacion.findUnique({
    where: { id: s.orgId },
    include: {
      _count: { select: { deportistas: true, usuarios: true, grupos: true } },
    },
  });
  if (!org) redirect("/app/cmd");

  const activos = await prisma.deportista.count({ where: { organizacionId: org.id, activo: true } });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="eyebrow">Organización</div>
      <h1 className="mt-1 font-display text-2xl font-extrabold text-ink">{org.nombre}</h1>
      <p className="text-sm text-slatey">
        {org.tipo} · Plan {PLAN_LABEL[org.plan] ?? org.plan}
        {org.cmdCubierta ? " · Cubierta por CMD en cancha" : ""}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <div className="font-display text-3xl font-extrabold text-ink">{activos}</div>
          <div className="text-xs text-slatey">Deportistas activos</div>
        </div>
        <div className="card p-5">
          <div className="font-display text-3xl font-extrabold text-ink">{org._count.usuarios}</div>
          <div className="text-xs text-slatey">Usuarios</div>
        </div>
        <div className="card p-5">
          <div className="font-display text-3xl font-extrabold text-ink">{org._count.grupos}</div>
          <div className="text-xs text-slatey">Grupos / categorías</div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link href="/app/organizacion/deportistas" className="card p-5 hover:shadow-pop">
          <div className="font-semibold text-ink">Deportistas</div>
          <div className="text-sm text-slatey">Alta, edición y baja de deportistas.</div>
        </Link>
        <Link href="/app/organizacion/deportistas/importar" className="card p-5 hover:shadow-pop">
          <div className="font-semibold text-ink">Importar por CSV</div>
          <div className="text-sm text-slatey">Cargá un plantel entero de una vez.</div>
        </Link>
        <Link href="/app/organizacion/usuarios" className="card p-5 hover:shadow-pop">
          <div className="font-semibold text-ink">Usuarios</div>
          <div className="text-sm text-slatey">Entrenadores, médicos y accesos de deportistas.</div>
        </Link>
        <Link href="/app/plantel" className="card p-5 hover:shadow-pop">
          <div className="font-semibold text-ink">Dashboard del plantel</div>
          <div className="text-sm text-slatey">Ranking de riesgo, alertas y carga semanal.</div>
        </Link>
      </div>
    </div>
  );
}
