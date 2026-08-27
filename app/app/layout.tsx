import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app/AppShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Plataforma",
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  // El deportista de una organización INDIVIDUAL ve su score completo;
  // el de un club/gimnasio solo carga datos (sin score ni "riesgo").
  let athleteIndividual = false;
  if (session.rol === "DEPORTISTA") {
    const dep = await prisma.deportista.findFirst({
      where: { usuarioId: session.sub },
      select: { organizacion: { select: { tipo: true } } },
    });
    athleteIndividual = dep?.organizacion?.tipo === "INDIVIDUAL";
  }

  return (
    <AppShell session={session} athleteIndividual={athleteIndividual}>
      {children}
    </AppShell>
  );
}
