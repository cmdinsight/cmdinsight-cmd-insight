import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AuthCard } from "@/components/auth/AuthCard";
import SetupForm from "@/components/auth/SetupForm";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  let alreadySetup = false;
  try {
    alreadySetup = (await prisma.usuario.count()) > 0;
  } catch {
    alreadySetup = false;
  }
  if (alreadySetup) redirect("/acceder");

  return (
    <AuthCard
      title="Configurar CMD Insight"
      subtitle="Creá la primera cuenta de administrador CMD. Desde ahí vas a poder dar de alta clubes, gimnasios y perfiles individuales."
    >
      <SetupForm />
    </AuthCard>
  );
}
