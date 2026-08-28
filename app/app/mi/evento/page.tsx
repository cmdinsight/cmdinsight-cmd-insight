import { requireRole } from "@/lib/auth";
import { getMiPerfil } from "@/lib/data/deportistas";
import { EventoForm } from "@/components/app/EventoForm";

export const dynamic = "force-dynamic";

export default async function EventoPage() {
  const session = await requireRole("DEPORTISTA");
  const perfil = (await getMiPerfil(session.sub)) ?? "EQUIPO";
  return <EventoForm perfil={perfil} />;
}
