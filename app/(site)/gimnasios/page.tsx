import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading, Check, CTASection } from "@/components/site/ui";
import { PRECIO_MENSUAL_UYU, precioUYU } from "@/lib/planes";

export const metadata: Metadata = {
  title: "Para gimnasios",
  description:
    "Ofrecé seguimiento médico profesional como parte de la experiencia del socio. Evaluación inicial, control de carga y menos responsabilidad legal.",
};

const BENEFICIOS = [
  "Evaluación médica inicial al registrarse cada socio.",
  "Control de carga por socio, con alertas automáticas.",
  "Diferenciador competitivo real frente a otros gimnasios.",
  "Reducción de responsabilidad legal ante incidentes.",
  "Gestión por grupos y niveles de entrenamiento.",
];

const PASOS = [
  { t: "Registro del gimnasio", d: "Alta en la plataforma CMD Insight en pocos minutos." },
  { t: "Carga de socios activos", d: "Se ingresan los socios con su ficha médica básica." },
  { t: "Capacitación del equipo", d: "Formación de los instructores, incluida en la suscripción." },
  { t: "Seguimiento semanal", d: "Control de carga y alertas automáticas, semana a semana." },
];

export default function GimnasiosPage() {
  return (
    <>
      <section className="section bg-gradient-to-b from-mist to-white">
        <div className="wrap">
          <div className="eyebrow">Segmento · Gimnasios</div>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold text-ink sm:text-5xl">
            Espacios de alta intensidad, con una población diversa
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slatey">
            CMD Insight permite ofrecer seguimiento médico profesional como parte de la
            experiencia del socio, sin sumar costos fijos.
          </p>
          <a href="https://wa.me/59896276998" className="btn btn-primary btn-lg mt-8">
            Consultá cómo sumarlo a tu gimnasio
          </a>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Beneficios" title="Qué gana el gimnasio" />
            <ul className="mt-8 space-y-3">
              {BENEFICIOS.map((b) => (
                <Check key={b}>{b}</Check>
              ))}
            </ul>
          </div>
          <div className="card flex items-center p-8">
            <blockquote className="font-display text-xl font-bold leading-snug text-ink">
              &ldquo;Un gimnasio que cuida la salud de sus socios con datos reales no es solo un
              lugar para entrenar — es una comunidad de bienestar.&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      <section className="section bg-mist">
        <div className="wrap">
          <SectionHeading eyebrow="Cómo empezar" title="Cuatro pasos" />
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PASOS.map((p, i) => (
              <li key={p.t} className="card-flat p-5">
                <div className="font-display text-2xl font-extrabold text-teal">0{i + 1}</div>
                <div className="mt-1 font-display text-base font-bold text-ink">{p.t}</div>
                <p className="mt-1 text-sm text-slatey">{p.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section pt-0">
        <div className="wrap">
          <div className="mx-auto max-w-md">
            <div className="card p-7 text-center">
              <div className="eyebrow">Plan Gimnasio</div>
              <div className="mt-3 font-display text-4xl font-extrabold text-ink">
                {precioUYU(PRECIO_MENSUAL_UYU.GIMNASIO)}
                <span className="text-base font-semibold text-slatey"> / mes</span>
              </div>
              <div className="mt-1 text-xs text-slatey">Pesos uruguayos · hasta 200 socios</div>
              <ul className="mx-auto mt-6 max-w-xs space-y-2 text-left">
                <Check>Dashboard y formularios para todos los socios</Check>
                <Check>Score de riesgo y alertas automáticas</Check>
                <Check>Gestión por grupos y niveles</Check>
                <Check>Capacitación del equipo de instructores incluida</Check>
                <Check>30 días de prueba, sin tarjeta</Check>
              </ul>
              <a href="https://wa.me/59896276998" className="btn btn-accent mt-7 w-full">
                Empezar la prueba de 30 días
              </a>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
