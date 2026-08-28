import { requireRole } from "@/lib/auth";
import { getMiPerfil } from "@/lib/data/deportistas";
import { ControlDiarioForm } from "@/components/app/ControlDiarioForm";

export const dynamic = "force-dynamic";

export default async function ControlDiarioPage() {
  const session = await requireRole("DEPORTISTA");
  const perfil = (await getMiPerfil(session.sub)) ?? "EQUIPO";
  return <ControlDiarioForm perfil={perfil} />;
}
