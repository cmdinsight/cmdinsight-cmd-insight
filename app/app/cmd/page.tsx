import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_LABEL, ORG_TIPO_LABEL } from "@/lib/planes";
import { SeedDemoButton } from "@/components/app/SeedDemoButton";

export const dynamic = "force-dynamic";

export default async function CmdPage() {
  await requireRole("ADMIN_CMD");

  const orgs = await prisma.organizacion.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { deportistas: true, usuarios: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-ink">Organizaciones</h1>
        <Link href="/app/cmd/nueva" className="btn btn-primary">Nueva organización</Link>
      </div>

      {orgs.length === 0 ? (
        <div className="card mt-6 p-8 text-sm text-slatey">
          Todavía no hay organizaciones. Creá una, o cargá los datos de demostración.
        </div>
      ) : (
        <div className="card mt-6 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-slatey">
                <th className="px-4 py-2.5">Organización</th>
                <th className="px-4 py-2.5">Tipo</th>
                <th className="px-4 py-2.5">Plan</th>
                <th className="px-4 py-2.5">Deportistas</th>
              </tr>
            </thead>
            <tbody>
              {orgs.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0 hover:bg-mist">
                  <td className="px-4 py-3">
                    <Link href={`/app/cmd/${o.id}`} className="font-semibold text-ink hover:underline">
                      {o.nombre}
                    </Link>
                    {o.cmdCubierta && <span className="ml-2 text-xs text-teal-deep">CMD en cancha</span>}
                  </td>
                  <td className="px-4 py-3 text-slatey">{ORG_TIPO_LABEL[o.tipo] ?? o.tipo}</td>
                  <td className="px-4 py-3 text-slatey">{PLAN_LABEL[o.plan] ?? o.plan}</td>
                  <td className="px-4 py-3 text-slatey">{o._count.deportistas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8">
        <SeedDemoButton />
      </div>
    </div>
  );
}
