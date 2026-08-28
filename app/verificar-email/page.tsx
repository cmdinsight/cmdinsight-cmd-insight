import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { confirmarEmail } from "@/lib/data/verificacion";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verificar email",
  robots: { index: false },
};

export default async function VerificarEmailPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = typeof searchParams.token === "string" ? searchParams.token : "";
  const ok = await confirmarEmail(token);

  return (
    <AuthCard
      title={ok ? "Email confirmado" : "No pudimos confirmar tu email"}
      subtitle={
        ok
          ? "Ya está: tu dirección quedó verificada."
          : "El enlace no es válido o ya se usó. Pedí uno nuevo desde tu panel."
      }
      footer={
        <Link href={ok ? "/app" : "/acceder"} className="font-semibold text-navy underline">
          {ok ? "Ir a mi panel" : "Ir a acceder"}
        </Link>
      }
    >
      <div className="text-sm text-slatey">
        {ok ? (
          <p>Podés cerrar esta pestaña y seguir usando la plataforma normalmente.</p>
        ) : (
          <p>
            Si ya iniciaste sesión, entrá a la plataforma y usá el botón{" "}
            <span className="font-semibold">“Reenviar verificación”</span> del aviso.
          </p>
        )}
      </div>
    </AuthCard>
  );
}
