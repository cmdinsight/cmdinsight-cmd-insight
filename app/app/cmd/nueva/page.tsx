import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { OrgForm } from "@/components/app/OrgForm";

export const dynamic = "force-dynamic";

export default async function NuevaOrgPage() {
  await requireRole("ADMIN_CMD");
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/app/cmd" className="text-sm text-slatey hover:underline">← Organizaciones</Link>
      <h1 className="mt-3 font-display text-2xl font-extrabold text-ink">Nueva organización</h1>
      <p className="mt-1 text-sm text-slatey">
        Se crea la organización y su primer usuario administrador, que ya puede iniciar sesión.
      </p>
      <div className="mt-6">
        <OrgForm />
      </div>
    </div>
  );
}
