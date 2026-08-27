import Link from "next/link";
import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow mb-3">{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  center,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-2xl`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">{title}</h2>
      {lead && <p className="mt-4 text-lg text-slatey">{lead}</p>}
    </div>
  );
}

export function Check({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <svg
        className="mt-1 h-4 w-4 flex-none text-teal"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M4 10l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-slatey">{children}</span>
    </li>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 text-center">
      <div className="font-display text-2xl font-extrabold text-navy sm:text-3xl">{value}</div>
      <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slatey">{label}</div>
    </div>
  );
}

export function CTASection() {
  return (
    <section id="contacto" className="section">
      <div className="wrap">
        <div className="overflow-hidden rounded-3xl bg-navy px-6 py-14 text-center text-white sm:px-14">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            Comenzá tu prueba gratuita hoy
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            30 días gratis para todos los segmentos, sin tarjeta. Accedé a la plataforma o
            coordiná una demo personalizada con nuestro equipo.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/acceder" className="btn btn-accent btn-lg">
              Acceder a la plataforma
            </Link>
            <a href="https://wa.me/59896276998" className="btn btn-lg bg-white text-navy hover:bg-white/90">
              Solicitar demo por WhatsApp
            </a>
          </div>
          <p className="mt-4 text-sm text-white/70">
            ¿Solo querés recorrerla?{" "}
            <Link href="/demo" className="font-semibold text-white underline">
              Ver la demo interactiva
            </Link>
          </p>
          <div className="mx-auto mt-8 grid max-w-xl gap-3 text-sm text-white/75 sm:grid-cols-2">
            <div>
              WhatsApp<br />
              <span className="font-semibold text-white">+598 96 276 998</span>
            </div>
            <div>
              Email<br />
              <span className="font-semibold text-white">administracion@coberturamedicad.com</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustStrip() {
  return (
    <section className="border-y border-line bg-mist">
      <div className="wrap grid gap-6 py-10 sm:grid-cols-3">
        <div>
          <div className="font-display text-lg font-bold text-ink">Trial gratuito 30 días</div>
          <p className="mt-1 text-sm text-slatey">Para todos los segmentos. Sin tarjeta requerida para comenzar.</p>
        </div>
        <div>
          <div className="font-display text-lg font-bold text-ink">Pagos seguros con dLocal</div>
          <p className="mt-1 text-sm text-slatey">Procesados por dLocal, plataforma líder en LATAM.</p>
        </div>
        <div>
          <div className="font-display text-lg font-bold text-ink">Plan Cortesía CMD</div>
          <p className="mt-1 text-sm text-slatey">Acceso gratuito asignado por CMD a instituciones seleccionadas.</p>
        </div>
      </div>
    </section>
  );
}
