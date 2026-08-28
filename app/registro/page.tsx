import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import RegistroForm from "@/components/auth/RegistroForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Crear cuenta individual",
  description:
    "Creá tu perfil de deportista individual en CMD Insight y empezá tu prueba de 30 días.",
};

export default async function RegistroPage() {
  const session = await getSession();
  if (session) redirect("/app");

  return (
    <AuthCard
      wide
      title="Creá tu perfil de deportista"
      subtitle="Plan individual: tu propio control de carga y riesgo de lesión. Prueba de 30 días."
      footer={
        <>
          ¿Ya tenés cuenta?{" "}
          <Link href="/acceder" className="font-semibold text-navy underline">
            Acceder
          </Link>{" "}
          · ¿Sos un club o gimnasio?{" "}
          <Link href="/contacto" className="font-semibold text-navy underline">
            Escribinos
          </Link>
        </>
      }
    >
      <RegistroForm />
    </AuthCard>
  );
}
