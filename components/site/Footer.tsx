import Link from "next/link";
import Logo from "@/components/Logo";
import { CONTACTO, lineaLegal } from "@/lib/legal";

export default function Footer() {
  return (
    <footer className="mt-24 bg-navy-deep text-white/80">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo variant="dark" height={30} />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            La plataforma de prevención de lesiones y gestión médica deportiva.
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
              <Link href="/contacto" className="hover:text-white">Formulario de contacto</Link>
            </li>
            <li>
              WhatsApp:{" "}
              <a href={CONTACTO.whatsappLink} className="hover:text-white">
                {CONTACTO.whatsapp}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACTO.email}`} className="hover:text-white">
                {CONTACTO.email}
              </a>
            </li>
          </ul>
        </div>

        <div className="text-sm">
          <div className="mb-3 font-semibold text-white">Legal</div>
          <ul className="space-y-2 text-white/70">
            <li><Link href="/terminos" className="hover:text-white">Términos y Condiciones</Link></li>
            <li><Link href="/privacidad" className="hover:text-white">Política de Privacidad</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-2 py-6 text-xs text-white/55">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <span>
              CMD Insight fue desarrollada por CMD Tech, la unidad tecnológica de Integra Medical Group.
            </span>
            <span className="italic">
              &ldquo;Profesionalizar la asistencia médica en el deporte no es una opción. Es una responsabilidad.&rdquo;
            </span>
          </div>
          <span>{lineaLegal()}</span>
        </div>
      </div>
    </footer>
  );
}
