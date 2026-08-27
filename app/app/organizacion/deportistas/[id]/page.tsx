import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DeportistaEditor } from "@/components/app/DeportistaEditor";

export const dynamic = "force-dynamic";

export default async function EditarDeportistaPage({ params }: { params: { id: string } }) {
  const s = await requireRole("ADMIN_ORG", "ADMIN_CMD");
  if (!s.orgId && s.rol !== "ADMIN_CMD") redirect("/app");

  const d = await prisma.deportista.findUnique({
    where: { id: params.id },
    include: { usuario: { select: { email: true } } },
  });
  if (!d) notFound();
  if (s.rol !== "ADMIN_CMD" && d.organizacionId !== s.orgId) notFound();

  const grupos = await prisma.grupo.findMany({
    where: { organizacionId: d.organizacionId },
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/app/organizacion/deportistas" className="text-sm text-slatey hover:underline">← Deportistas</Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold text-ink">{d.nombre}</h1>
        <Link href={`/app/plantel/${d.id}`} className="btn btn-ghost">Ver score y ficha</Link>
      </div>
      <p className="mt-1 text-sm text-slatey">
        {d.usuario ? `Acceso vinculado: ${d.usuario.email}` : "Sin acceso de deportista vinculado."}
        {!d.activo && " · Dado de baja"}
      </p>

      <div className="mt-6">
        <DeportistaEditor
          d={{
            id: d.id,
            nombre: d.nombre,
            posicion: d.posicion,
            dorsal: d.dorsal,
            grupoId: d.grupoId,
            activo: d.activo,
            organizacionId: d.organizacionId,
          }}
          grupos={grupos}
        />
      </div>
    </div>
  );
}
