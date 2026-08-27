"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

const LINKS = [
  { href: "/clubes", label: "Clubes" },
  { href: "/gimnasios", label: "Gimnasios" },
  { href: "/deportistas", label: "Deportistas" },
  { href: "/como-funciona", label: "Cómo funciona" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <nav className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center" aria-label="CMD Insight — inicio">
          <Logo height={30} />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  active ? "text-navy" : "text-slatey hover:text-navy"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/acceder" className="btn btn-ghost">
            Acceder
          </Link>
          <Link href="/#contacto" className="btn btn-primary">
            Solicitar demo
          </Link>
        </div>

        <button
          className="rounded-lg border border-line p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menú"
          aria-expanded={open}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-white px-5 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink hover:bg-mist"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/acceder" onClick={() => setOpen(false)} className="btn btn-ghost w-full">
              Acceder
            </Link>
            <Link href="/#contacto" onClick={() => setOpen(false)} className="btn btn-primary w-full">
              Solicitar demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
