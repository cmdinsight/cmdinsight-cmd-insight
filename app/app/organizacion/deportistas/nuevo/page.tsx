import { redirect } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DeportistaForm } from "@/components/app/DeportistaForm";

export const dynamic = "force-dynamic";

export default async function NuevoDeportistaPage() {
  const s = await requireRole("ADMIN_ORG", "ADMIN_CMD");
  if (!s.orgId) redirect("/app/cmd");
  const grupos = await prisma.grupo.findMany({
    where: { organizacionId: s.orgId },
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/app/organizacion/deportistas" className="text-sm text-slatey hover:underline">← Deportistas</Link>
      <h1 className="mt-3 font-display text-2xl font-extrabold text-ink">Nuevo deportista</h1>
      <div className="mt-6">
        <DeportistaForm grupos={grupos} />
      </div>
    </div>
  );
}
