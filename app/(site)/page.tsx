import Link from "next/link";
import { SectionHeading, Stat, CTASection, TrustStrip } from "@/components/site/ui";
import InteractiveScore from "@/components/demo/InteractiveScore";

const PROBLEMAS = [
  { t: "Fatiga y estrés sin registrar", d: "La carga mental y física se acumula sin que nadie la mida. Cuando se nota, ya es tarde." },
  { t: "Mal descanso", d: "Noches de sueño pobre sostenidas son uno de los predictores más fuertes de lesión muscular." },
  { t: "Picos de carga bruscos", d: "Un salto repentino en el volumen de entrenamiento dispara el riesgo en los días siguientes." },
  { t: "Dolor no reportado", d: "El jugador “aguanta” una molestia hasta que se transforma en lesión y baja tres semanas." },
];

const PILARES = [
  { t: "Prevención", d: "Score de riesgo algorítmico que identifica deportistas en riesgo antes de que aparezca la lesión." },
  { t: "Gestión", d: "Registro digital de cada deportista: historial médico, métricas de carga y evolución en el tiempo." },
  { t: "Acción", d: "Protocolos de respuesta con el equipo médico y alertas automáticas al cuerpo técnico." },
];

const FEATURES = [
  { t: "Ficha médica digital", d: "Antecedentes, lesiones previas, medicación, chequeos precompetitivos y ECG informados. Todo centralizado." },
  { t: "Control de carga deportiva", d: "Registro y seguimiento de la carga semanal. El sistema detecta picos que correlacionan con lesión." },
  { t: "Score de riesgo algorítmico", d: "Combina carga, fatiga, dolor y eventos en un indicador 0–7 con clasificación por color." },
  { t: "Dashboard de rendimiento", d: "Métricas por deportista, por equipo y por período. Informes exportables para médicos y directivos." },
  { t: "Alertas y notificaciones", d: "Avisos automáticos cuando el score supera el umbral o cambia bruscamente." },
  { t: "Integración con cobertura CMD", d: "Los deportistas cubiertos por CMD en cancha quedan registrados, con acceso a su historial en tiempo real." },
];

const ONBOARDING = [
  { t: "Registro", d: "El club, gimnasio o deportista se registra en menos de 10 minutos." },
  { t: "Carga de datos", d: "Se ingresan las fichas médicas. Importación masiva para planteles grandes." },
  { t: "Monitoreo continuo", d: "Los deportistas completan formularios breves post-entrenamiento." },
  { t: "Análisis algorítmico", d: "El motor procesa los datos y actualiza el score de riesgo de cada uno." },
  { t: "Acción preventiva", d: "El equipo recibe recomendaciones concretas: reducir carga, consulta o recuperación." },
  { t: "Reportes y seguimiento", d: "Informes periódicos para la directiva, el cuerpo técnico y el médico. Auditable." },
];

const RAZONES = [
  "Desarrollado por médicos de emergencia, no software genérico: lo diseñó el Dr. Manuel González.",
  "Integrado con cobertura médica real: CMD ya cubre más de 40 instituciones deportivas en Uruguay.",
  "Modelo escalable sin complejidad: desde un deportista individual hasta un club con 200 jugadores.",
  "Primero en Uruguay en combinar cobertura médica en cancha con plataforma de prevención de lesiones.",
];

export default function HomePage() {
  return (
    <>
      {/* 1 · HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-mist to-white" />
        <div className="wrap grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="chip">Clubes deportivos</span>
              <span className="chip">Gimnasios</span>
              <span className="chip">Deportistas individuales</span>
            </div>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] text-ink sm:text-5xl">
              Prevení lesiones antes de que ocurran
            </h1>
            <p className="mt-4 max-w-xl text-xl text-teal-deep">
              No solo cubrimos lesiones — las anticipamos.
            </p>
            <p className="mt-4 max-w-xl text-slatey">
              La mayoría de las lesiones no aparecen de golpe: dan señales. CMD Insight capta esas
              señales todos los días, sin GPS ni sensores caros, y calcula un score de riesgo automático.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/acceder" className="btn btn-primary btn-lg">
                Comenzá tu prueba gratuita
              </Link>
              <Link href="/como-funciona" className="btn btn-ghost btn-lg">
                Ver cómo funciona
              </Link>
            </div>
            <p className="mt-3 text-sm text-slatey">
              ¿Preferís recorrerla primero?{" "}
              <Link href="/demo" className="font-semibold text-navy underline">
                Ver la demo
              </Link>
            </p>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
              <Stat value="3" label="formularios simples" />
              <Stat value="2 min" label="por día" />
              <Stat value="7–10 días" label="de anticipación" />
            </div>
          </div>

          <div className="card p-6">
            <div className="eyebrow">Semáforo de riesgo</div>
            <p className="mt-2 text-sm text-slatey">
              Cada deportista tiene un score de 0 a 7 que combina cuatro indicadores clínicos.
            </p>
            <div className="mt-5 space-y-3">
              {[
                { c: "risk-low", n: "0–2", t: "Riesgo bajo", d: "Entrena normal, sin restricciones." },
                { c: "risk-mod", n: "3–4", t: "Riesgo moderado", d: "Vigilar, ajustar carga, recuperación activa." },
                { c: "risk-high", n: "5–7", t: "Riesgo alto", d: "Probable lesión en 7–10 días: reducir carga y evaluación médica." },
              ].map((r) => (
                <div key={r.n} className="flex items-start gap-3 rounded-xl border border-line p-3">
                  <span className={`risk-dot mt-1.5 ${r.c}`} style={{ background: "currentColor" }} />
                  <div>
                    <div className="text-sm font-bold text-ink">
                      {r.t} <span className="font-normal text-slatey">· {r.n}</span>
                    </div>
                    <div className="text-xs text-slatey">{r.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2 · EL PROBLEMA */}
      <section className="section bg-ink text-white">
        <div className="wrap">
          <div className="max-w-2xl">
            <div className="eyebrow">El problema</div>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              En el deporte uruguayo, la mayoría de las lesiones son repetitivas y predecibles.
              Pero sin datos, nadie las anticipa.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROBLEMAS.map((p) => (
              <div key={p.t} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="font-display text-lg font-bold">{p.t}</div>
                <p className="mt-2 text-sm text-white/70">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 · QUÉ ES */}
      <section className="section">
        <div className="wrap">
          <SectionHeading
            eyebrow="La plataforma"
            title="Qué es CMD Insight"
            lead="Combina datos clínicos, indicadores de carga de entrenamiento y un algoritmo de riesgo para anticipar lesiones, optimizar el rendimiento y profesionalizar el seguimiento médico."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {PILARES.map((p, i) => (
              <div key={p.t} className="card p-6">
                <div className="font-display text-sm font-bold uppercase tracking-wide text-teal-deep">
                  0{i + 1} · {p.t}
                </div>
                <p className="mt-3 text-slatey">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · CÓMO FUNCIONA */}
      <section id="como-funciona" className="section bg-mist">
        <div className="wrap">
          <SectionHeading
            eyebrow="Cómo funciona"
            title="Del formulario del jugador a la decisión del cuerpo técnico"
            lead="Tres pasos, todos los días, desde cualquier celular."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { n: "1", t: "El jugador", d: "Completa formularios breves post-entrenamiento: carga, fatiga, dolor, sueño y estrés, con escalas numéricas y zona corporal." },
              { n: "2", t: "El algoritmo", d: "Combina automáticamente 4 sub-scores (ACWR, IFS, dolor y evento) en un score final 0–7 con clasificación por color." },
              { n: "3", t: "El cuerpo técnico", d: "Dashboard con el estado del plantel, alertas automáticas y gráfico de carga semanal." },
            ].map((s) => (
              <div key={s.n} className="card p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy font-display text-sm font-bold text-white">
                  {s.n}
                </div>
                <div className="mt-4 font-display text-lg font-bold text-ink">{s.t}</div>
                <p className="mt-2 text-sm text-slatey">{s.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <InteractiveScore />
          </div>
          <p className="mt-4 text-sm text-slatey">
            ¿Querés ver el detalle de cada sub-score y casos de referencia?{" "}
            <Link href="/como-funciona" className="font-semibold text-navy underline">
              Mirá cómo se calcula
            </Link>
            .
          </p>
        </div>
      </section>

      {/* 5 · FUNCIONALIDADES */}
      <section className="section">
        <div className="wrap">
          <SectionHeading eyebrow="Funcionalidades" title="Qué incluye la plataforma" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.t} className="card-flat p-5">
                <div className="font-display text-base font-bold text-ink">{f.t}</div>
                <p className="mt-2 text-sm text-slatey">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 · SEGMENTOS */}
      <section className="section bg-mist">
        <div className="wrap">
          <SectionHeading eyebrow="Para quién" title="Un modelo que escala con vos" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { h: "/clubes", t: "Clubes deportivos", d: "Gestioná la salud de todo el plantel con recursos médicos limitados. Suscripción incluida con planes de cobertura CMD para clubes AUF." },
              { h: "/gimnasios", t: "Gimnasios", d: "Ofrecé seguimiento médico profesional como parte de la experiencia del socio y reducí responsabilidad legal." },
              { h: "/deportistas", t: "Deportistas individuales", d: "Corredores, ciclistas, triatletas y amateurs: las mismas herramientas de prevención que usan los equipos profesionales." },
            ].map((s) => (
              <Link key={s.h} href={s.h} className="card group p-6 transition-shadow hover:shadow-pop">
                <div className="font-display text-lg font-bold text-ink">{s.t}</div>
                <p className="mt-2 text-sm text-slatey">{s.d}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-navy group-hover:underline">
                  Ver más →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7 · ONBOARDING */}
      <section className="section">
        <div className="wrap">
          <SectionHeading
            eyebrow="Proceso"
            title="Cómo se implementa"
            lead="Plataforma 100% web, sin instalación, acceso seguro desde cualquier dispositivo. Datos encriptados con estándares de privacidad médica."
          />
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ONBOARDING.map((o, i) => (
              <li key={o.t} className="card-flat p-5">
                <div className="font-display text-2xl font-extrabold text-teal">0{i + 1}</div>
                <div className="mt-1 font-display text-base font-bold text-ink">{o.t}</div>
                <p className="mt-1 text-sm text-slatey">{o.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8 · POR QUÉ ELEGIR */}
      <section className="section bg-navy text-white">
        <div className="wrap">
          <div className="eyebrow">Por qué elegir CMD Insight</div>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold sm:text-4xl">
            No es un producto aislado. Es la extensión digital de un servicio médico que ya funciona.
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {RAZONES.map((r) => (
              <li key={r} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <svg className="mt-1 h-5 w-5 flex-none text-teal-soft" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 10l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-white/85">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 9 · PLANES Y CONFIANZA */}
      <TrustStrip />

      {/* 10 · CTA + CONTACTO */}
      <CTASection />
    </>
  );
}
