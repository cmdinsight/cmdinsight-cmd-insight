import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app/AppShell";
import { TrialVencido } from "@/components/app/TrialVencido";
import { trialInfo } from "@/lib/trial";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Plataforma",
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  const [usuario, deportista, organizacion] = await Promise.all([
    prisma.usuario.findUnique({
      where: { id: session.sub },
      select: { emailVerificadoEn: true },
    }),
    session.rol === "DEPORTISTA"
      ? prisma.deportista.findFirst({
          where: { usuarioId: session.sub },
          select: { organizacion: { select: { tipo: true } } },
        })
      : Promise.resolve(null),
    session.orgId
      ? prisma.organizacion.findUnique({
          where: { id: session.orgId },
          select: { tipo: true, plan: true, trialHasta: true },
        })
      : Promise.resolve(null),
  ]);

  // El deportista de una organización INDIVIDUAL ve su score completo;
  // el de un club/gimnasio solo carga datos (sin score ni "riesgo").
  const athleteIndividual = deportista?.organizacion?.tipo === "INDIVIDUAL";

  const trial = trialInfo(organizacion);
  // La verificación de email solo aplica al alta self-serve (deportista individual);
  // las cuentas creadas por un administrador se consideran ya verificadas.
  const emailVerificado = !athleteIndividual || !!usuario?.emailVerificadoEn;

  // Plan individual con prueba vencida: pantalla de "prueba terminada"
  // (recuperable: el admin puede extender la prueba o asignar un plan).
  const bloquear =
    session.rol === "DEPORTISTA" && athleteIndividual && trial.estado === "vencido";

  return (
    <AppShell
      session={session}
      athleteIndividual={athleteIndividual}
      trial={trial}
      emailVerificado={emailVerificado}
    >
      {bloquear ? <TrialVencido venceEl={trial.venceEl} /> : children}
    </AppShell>
  );
}
