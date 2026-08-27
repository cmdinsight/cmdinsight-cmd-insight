"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string };

export function AppNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/app" ? pathname === "/app" : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <button
        className="rounded-lg border border-line p-2 md:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menú"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <nav className="hidden gap-1 md:flex">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              isActive(it.href) ? "bg-mist text-navy" : "text-slatey hover:text-navy"
            }`}
          >
            {it.label}
          </Link>
        ))}
      </nav>

      {open && (
        <div className="absolute left-0 right-0 top-14 z-40 border-b border-line bg-white p-3 md:hidden">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm font-semibold ${
                isActive(it.href) ? "bg-mist text-navy" : "text-ink"
              }`}
            >
              {it.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
