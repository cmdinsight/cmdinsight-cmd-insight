"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/demo/deportista", label: "Deportista", match: "/demo/deportista" },
  { href: "/demo/panel", label: "Cuerpo técnico / médico", match: "/demo/panel" },
];

export function DemoNav() {
  const pathname = usePathname();
  return (
    <div className="wrap flex gap-1 overflow-x-auto">
      {TABS.map((t) => {
        const active = pathname.startsWith(t.match);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`-mb-px whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
              active
                ? "border-navy text-navy"
                : "border-transparent text-slatey hover:text-navy"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
