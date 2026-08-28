import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getMiDeportista } from "@/lib/data/deportistas";
import { PlayerInsight } from "@/components/demo/PlayerInsight";

export const dynamic = "force-dynamic";

export default async function MiEvolucionPage() {
  const session = await requireRole("DEPORTISTA");
  const d = await getMiDeportista(session.sub);

  if (!d) {
    return <div className="card p-6 text-sm text-slatey">Tu usuario no está vinculado a un perfil de deportista.</div>;
  }

  // Los deportistas de una institución no ven su score; lo maneja el cuerpo técnico.
  if (d.organizacion?.tipo !== "INDIVIDUAL") redirect("/app/mi");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-ink">Mi score y evolución</h1>
        <Link href="/app/mi" className="btn btn-ghost">Volver</Link>
      </div>
      <p className="mt-2 text-sm text-slatey">
        Cuanto más completás los formularios, más preciso es. Ante cualquier duda, consultá con un
        profesional.
      </p>
      <div className="mt-6">
        <PlayerInsight dailyLogs={d.dailyLogs} events={d.events} weekly={d.weekly} perfil={d.perfil} tono="simple" conducta />
      </div>
    </div>
  );
}
