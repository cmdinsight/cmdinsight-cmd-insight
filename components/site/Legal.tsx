import type { ReactNode } from "react";

export function LegalDoc({
  title,
  actualizado,
  children,
}: {
  title: string;
  actualizado: string;
  children: ReactNode;
}) {
  return (
    <section className="section">
      <div className="wrap max-w-3xl">
        <div className="eyebrow">Legal</div>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-slatey">Última actualización: {actualizado}</p>
        <div className="mt-8 space-y-6">{children}</div>
      </div>
    </section>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="font-display text-xl font-bold text-ink">{children}</h2>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-relaxed text-slatey">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-slatey">{children}</ul>;
}

export function Section({ h, children }: { h: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <H2>{h}</H2>
      {children}
    </div>
  );
}
