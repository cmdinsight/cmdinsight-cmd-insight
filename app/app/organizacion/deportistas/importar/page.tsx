import { redirect } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { ImportForm } from "@/components/app/ImportForm";

export const dynamic = "force-dynamic";

export default async function ImportarPage() {
  const s = await requireRole("ADMIN_ORG", "ADMIN_CMD");
  if (!s.orgId) redirect("/app/cmd");

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/app/organizacion/deportistas" className="text-sm text-slatey hover:underline">← Deportistas</Link>
      <h1 className="mt-3 font-display text-2xl font-extrabold text-ink">Importar deportistas</h1>
      <div className="mt-6">
        <ImportForm />
      </div>
    </div>
  );
}
