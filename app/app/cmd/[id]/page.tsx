import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROL_LABEL } from "@/lib/roles";
import { OrgEditor } from "@/components/app/OrgEditor";

export const dynamic = "force-dynamic";

export default async function OrgDetailPage({ params }: { params: { id: string } }) {
  await requireRole("ADMIN_CMD");

  const org = await prisma.organizacion.findUnique({
    where: { id: params.id },
    include: {
      usuarios: { select: { id: true, nombre: true, email: true, rol: true }, orderBy: { nombre: "asc" } },
      _count: { select: { deportistas: true } },
    },
  });
  if (!org) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/app/cmd" className="text-sm text-slatey hover:underline">← Organizaciones</Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold text-ink">{org.nombre}</h1>
        <Link href={`/app/plantel?org=${org.id}`} className="btn btn-ghost">Ver plantel ({org._count.deportistas})</Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <OrgEditor
          org={{
            id: org.id,
            nombre: org.nombre,
            plan: org.plan,
            cmdCubierta: org.cmdCubierta,
            trialHasta: org.trialHasta ? org.trialHasta.toISOString() : null,
            notas: org.notas,
          }}
        />

        <div className="card p-5">
          <div className="font-display text-sm font-bold text-ink">Usuarios ({org.usuarios.length})</div>
          <ul className="mt-3 divide-y divide-line text-sm">
            {org.usuarios.map((u) => (
              <li key={u.id} className="flex items-center justify-between py-2.5">
                <div>
                  <div className="font-medium text-ink">{u.nombre}</div>
                  <div className="text-xs text-slatey">{u.email}</div>
                </div>
                <span className="chip">{ROL_LABEL[u.rol as keyof typeof ROL_LABEL] ?? u.rol}</span>
              </li>
            ))}
            {org.usuarios.length === 0 && <li className="py-2.5 text-slatey">Sin usuarios.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
