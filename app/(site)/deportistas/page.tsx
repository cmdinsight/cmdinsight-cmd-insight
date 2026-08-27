import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading, Check, CTASection } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Para deportistas individuales",
  description:
    "Corredores, ciclistas, triatletas y amateurs: por primera vez, las mismas herramientas de prevención que usan los equipos profesionales.",
};

const BENEFICIOS = [
  "Tu historial médico deportivo, centralizado.",
  "Score de riesgo personalizado, actualizado con cada control.",
  "Planificación de cargas para no pasarte de rosca.",
  "Acceso a la red CMD de cobertura médica deportiva.",
  "Informes claros para llevarle a tu médico.",
  "Acceso desde cualquier dispositivo, sin instalar nada.",
];

const PLANES = [
  {
    t: "Plan Individual",
    items: ["Perfil médico básico", "Score de riesgo", "Control de cargas", "Acceso web"],
    cta: "Consultá precio en la web",
    highlight: false,
  },
  {
    t: "Plan Premium Individual",
    items: [
      "Todo lo del plan básico",
      "Informes para tu médico",
      "Chequeo precompetitivo",
      "Prioridad en la red CMD",
    ],
    cta: "Consultá precio en la web",
    highlight: true,
  },
];

export default function DeportistasPage() {
  return (
    <>
      <section className="section bg-gradient-to-b from-mist to-white">
        <div className="wrap">
          <div className="eyebrow">Segmento · Deportistas individuales</div>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold text-ink sm:text-5xl">
            Las mismas herramientas de prevención que usan los equipos profesionales
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slatey">
            Corredores, ciclistas, triatletas, jugadores amateur y cualquier persona que entrena
            regularmente. Por primera vez, el deportista individual accede a su propio perfil en CMD Insight.
          </p>
          <Link href="/demo/deportista" className="btn btn-primary btn-lg mt-8">
            Probar los formularios
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHeading eyebrow="Beneficios" title="Qué incluye tu perfil" />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {BENEFICIOS.map((b) => (
              <Check key={b}>{b}</Check>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-mist">
        <div className="wrap">
          <SectionHeading eyebrow="Planes" title="Elegí tu nivel" center />
          <div className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-2">
            {PLANES.map((p) => (
              <div
                key={p.t}
                className={`card p-6 ${p.highlight ? "ring-2 ring-teal" : ""}`}
              >
                {p.highlight && <div className="eyebrow mb-2">Más elegido</div>}
                <div className="font-display text-lg font-bold text-ink">{p.t}</div>
                <ul className="mt-4 space-y-2">
                  {p.items.map((it) => (
                    <Check key={it}>{it}</Check>
                  ))}
                </ul>
                <a
                  href="https://wa.me/59896276998"
                  className={`btn mt-6 w-full ${p.highlight ? "btn-accent" : "btn-ghost"}`}
                >
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
