import Link from "next/link";
import type { Metadata } from "next";
import Logo from "@/components/Logo";
import { DemoNav } from "@/components/demo/DemoNav";

export const metadata: Metadata = {
  title: "Demo de la plataforma",
  description: "Formularios del deportista y dashboard del cuerpo técnico, con datos simulados.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mist">
      <header className="border-b border-line bg-white">
        <div className="wrap flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="CMD Insight">
            <Logo height={26} />
          </Link>
          <span className="chip">Demo · datos simulados</span>
        </div>
        <DemoNav />
      </header>
      <main className="wrap py-8">{children}</main>
      <footer className="wrap pb-10 pt-4 text-xs text-slatey">
        Entorno de demostración de CMD Insight. Los datos son ficticios y se guardan solo en este
        navegador. ·{" "}
        <Link href="/" className="underline">
          Volver al sitio
        </Link>
      </footer>
    </div>
  );
}
