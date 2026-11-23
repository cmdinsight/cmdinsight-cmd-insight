import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app/AppShell";
import { TrialVencido } from "@/components/app/TrialVencido";
import { PagoPendiente } from "@/components/app/PagoPendiente";
import { trialInfo } from "@/lib/trial";
import { bloqueadoPorPago, linkDePago, sincronizarCobros } from "@/lib/data/cobros";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Plataforma",
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  const leerOrg = () =>
    session.orgId
      ? prisma.organizacion.findUnique({
          where: { id: session.orgId },
          select: {
            tipo: true,
            plan: true,
            trialHasta: true,
            suscripcion: { select: { estado: true, pagaHasta: true } },
          },
        })
      : Promise.resolve(null);

  const [usuario, deportista, orgInicial] = await Promise.all([
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
    leerOrg(),
  ]);
  let organizacion = orgInicial;

  // El deportista de una organización INDIVIDUAL ve su score completo;
  // el de un club/gimnasio solo carga datos (sin score ni "riesgo").
  const athleteIndividual = deportista?.organizacion?.tipo === "INDIVIDUAL";
  const esIndividual = session.rol === "DEPORTISTA" && athleteIndividual;

  // ¿Hay que frenarlo? Prueba vencida, o Plan Individual cuyo cobro mensual no
  // entró (rechazado o dado de baja).
  const frenado = (o: typeof organizacion) =>
    esIndividual &&
    (trialInfo(o).estado === "vencido" || bloqueadoPorPago(o, o?.suscripcion));

  // Antes de frenarlo, preguntamos a dLocal si ya pagó (por ejemplo, vuelve
  // recién del checkout y el aviso de dLocal todavía no llegó).
  if (frenado(organizacion)) {
    const r = await sincronizarCobros();
    if (r.ok && !r.omitida) organizacion = await leerOrg();
  }

  const trial = trialInfo(organizacion);
  // La verificación de email solo aplica al alta self-serve (deportista individual);
  // las cuentas creadas por un administrador se consideran ya verificadas.
  const emailVerificado = !athleteIndividual || !!usuario?.emailVerificadoEn;

  // Plan individual con prueba vencida: pantalla de "prueba terminada"
  // (recuperable: el admin puede extender la prueba o asignar un plan).
  const bloquear = esIndividual && trial.estado === "vencido";
  const sinPago = esIndividual && bloqueadoPorPago(organizacion, organizacion?.suscripcion);
  const linkPago = bloquear || sinPago ? await linkDePago(session.email) : null;

  return (
    <AppShell
      session={session}
      athleteIndividual={athleteIndividual}
      trial={trial}
      emailVerificado={emailVerificado}
    >
      {bloquear ? (
        <TrialVencido venceEl={trial.venceEl} linkPago={linkPago} />
      ) : sinPago ? (
        <PagoPendiente estado={organizacion?.suscripcion?.estado ?? ""} linkPago={linkPago} />
      ) : (
        children
      )}
    </AppShell>
  );
}
