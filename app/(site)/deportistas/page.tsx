import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading, Check, CTASection } from "@/components/site/ui";
import { PRECIO_MENSUAL_UYU, precioUYU } from "@/lib/planes";

export const metadata: Metadata = {
  title: "Para deportistas individuales",
  description:
    "Corredores, ciclistas, triatletas y amateurs: la herramienta de prevención que usan los equipos profesionales, para llevar tu propio control.",
};

const BENEFICIOS = [
  "Tu historial deportivo, centralizado.",
  "Score de riesgo personalizado, actualizado con cada control.",
  "Control y planificación de tus cargas de entrenamiento.",
  "Análisis de tendencia: fatiga, sueño, dolor y carga a lo largo del tiempo.",
  "Informes que podés compartir con tu médico o preparador físico.",
  "Acceso desde cualquier dispositivo, sin instalar nada.",
];

export default function DeportistasPage() {
  return (
    <>
      <section className="section bg-gradient-to-b from-mist to-white">
        <div className="wrap">
          <div className="eyebrow">Segmento · Deportistas individuales</div>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold text-ink sm:text-5xl">
            La herramienta de prevención que usan los equipos profesionales
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slatey">
            Corredores, ciclistas, triatletas, jugadores amateur y cualquier persona que entrena
            regularmente. Llevá tu propio control de carga y riesgo en 2 minutos por día.
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
          <SectionHeading eyebrow="Plan" title="Un solo plan, simple" center />
          <div className="mx-auto mt-10 max-w-md">
            <div className="card p-7 text-center">
              <div className="font-display text-lg font-bold text-ink">Plan Individual</div>
              <div className="mt-3 font-display text-4xl font-extrabold text-ink">
                {precioUYU(PRECIO_MENSUAL_UYU.INDIVIDUAL)}
                <span className="text-base font-semibold text-slatey"> / mes</span>
              </div>
              <div className="mt-1 text-xs text-slatey">Pesos uruguayos · pago mensual por la web</div>
              <ul className="mx-auto mt-6 max-w-xs space-y-2 text-left">
                <Check>Score de riesgo diario</Check>
                <Check>Control de cargas y análisis de tendencia</Check>
                <Check>Historial deportivo e informes descargables</Check>
                <Check>Acceso web desde cualquier dispositivo</Check>
              </ul>
              <a href="https://wa.me/59896276998" className="btn btn-accent mt-7 w-full">
                Empezar la prueba de 30 días
              </a>
              <p className="mt-3 text-xs text-slatey">
                Es una herramienta de autocontrol, no reemplaza la consulta con un profesional de la salud.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
