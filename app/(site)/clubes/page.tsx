import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading, CTASection } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Para clubes deportivos",
  description:
    "CMD Insight centraliza la salud de todo el plantel y permite decisiones clínicas con datos reales. Suscripción incluida con planes de cobertura CMD para clubes AUF.",
};

const CASOS = [
  {
    t: "Gestión de plantel completo",
    d: "Ficha digital para cada jugador: historial médico, lesiones previas, chequeos y ECG. El médico accede desde cualquier dispositivo antes, durante y después de cada partido.",
  },
  {
    t: "Control de cargas y prevención por categoría",
    d: "Registro semanal de la carga de entrenamiento por categoría. El score de riesgo identifica qué jugadores necesitan reducir carga antes de que aparezca la lesión.",
  },
  {
    t: "Informes semanales al cuerpo técnico",
    d: "Cada lunes, un informe de estado de plantel: disponibles, en recuperación y en riesgo. Sin intermediarios ni llamados de último momento.",
  },
  {
    t: "Integración con cobertura en cancha",
    d: "Cuando CMD cubre un partido, el médico tiene acceso inmediato a la ficha de cada jugador. En una emergencia, la información está disponible en segundos.",
  },
  {
    t: "Historial exportable para AUF, ligas y transferencias",
    d: "Documentación médica organizada y exportable para presentar ante la AUF, ligas o en procesos de transferencia de jugadores.",
  },
];

export default function ClubesPage() {
  return (
    <>
      <section className="section bg-gradient-to-b from-mist to-white">
        <div className="wrap">
          <div className="eyebrow">Segmento · Clubes deportivos</div>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold text-ink sm:text-5xl">
            La salud de decenas o cientos de deportistas, con recursos médicos limitados
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slatey">
            CMD Insight centraliza toda la información del plantel y permite tomar decisiones
            clínicas con datos reales, no con corazonadas.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="https://wa.me/59896276998" className="btn btn-primary btn-lg">
              Consultá los planes con el equipo comercial
            </a>
            <Link href="/demo/panel" className="btn btn-ghost btn-lg">
              Ver el dashboard de plantel
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHeading eyebrow="Casos de uso" title="Para qué lo usa un club" />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {CASOS.map((c) => (
              <div key={c.t} className="card p-6">
                <div className="font-display text-lg font-bold text-ink">{c.t}</div>
                <p className="mt-2 text-sm text-slatey">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="wrap">
          <div className="rounded-3xl border border-teal/30 bg-teal/[0.06] p-8 sm:p-10">
            <div className="eyebrow">Incluido con plan mensual CMD</div>
            <h2 className="mt-3 font-display text-2xl font-extrabold text-ink sm:text-3xl">
              Suscripción anual a CMD Insight completamente gratis
            </h2>
            <p className="mt-3 max-w-2xl text-slatey">
              Con cualquier plan mensual de cobertura médica CMD para clubes AUF. Consultá los
              planes disponibles con nuestro equipo comercial.
            </p>
            <a href="https://wa.me/59896276998" className="btn btn-accent btn-lg mt-6">
              Hablar con el equipo comercial
            </a>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
