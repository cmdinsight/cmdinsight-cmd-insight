import Link from "next/link";
import { LogoWordmark } from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="mt-24 bg-navy-deep text-white/80">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <LogoWordmark className="text-xl" />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            La plataforma de prevención de lesiones y gestión médica deportiva de CMD.
            No solo cubrimos lesiones — las anticipamos.
          </p>
        </div>

        <div className="text-sm">
          <div className="mb-3 font-semibold text-white">Plataforma</div>
          <ul className="space-y-2 text-white/70">
            <li><Link href="/clubes" className="hover:text-white">Para clubes</Link></li>
            <li><Link href="/gimnasios" className="hover:text-white">Para gimnasios</Link></li>
            <li><Link href="/deportistas" className="hover:text-white">Para deportistas</Link></li>
            <li><Link href="/como-funciona" className="hover:text-white">Cómo funciona</Link></li>
            <li><Link href="/demo" className="hover:text-white">Acceder / ver demo</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <div className="mb-3 font-semibold text-white">Contacto</div>
          <ul className="space-y-2 text-white/70">
            <li>
              WhatsApp:{" "}
              <a href="https://wa.me/59896276998" className="hover:text-white">
                +598 96 276 998
              </a>
            </li>
            <li>
              <a href="mailto:administracion@coberturamedicad.com" className="hover:text-white">
                administracion@coberturamedicad.com
              </a>
            </li>
            <li>
              <a href="https://insights.coberturamedicad.com/" className="hover:text-white">
                insights.coberturamedicad.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-2 py-6 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <span>CMD — Cobertura Médica Deportiva · Dr. Manuel González · RUT: 220266830010</span>
          <span className="italic">
            &ldquo;Profesionalizar la asistencia médica en el deporte no es una opción. Es una responsabilidad.&rdquo;
          </span>
        </div>
      </div>
    </footer>
  );
}
