import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthCard } from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

export const dynamic = "force-dynamic";

export default async function AccederPage() {
  const session = await getSession();
  if (session) redirect("/app");

  let needsSetup = false;
  try {
    needsSetup = (await prisma.usuario.count()) === 0;
  } catch {
    needsSetup = false;
  }
  if (needsSetup) redirect("/setup");

  return (
    <AuthCard
      title="Acceder a la plataforma"
      subtitle="Ingresá con la cuenta de tu club, gimnasio o perfil individual."
      footer={
        <>
          ¿Solo querés ver cómo funciona?{" "}
          <Link href="/demo" className="font-semibold text-navy underline">
            Ver la demo
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="text-sm text-slatey">Cargando…</div>}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
