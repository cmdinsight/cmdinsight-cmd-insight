import Link from "next/link";
import Logo from "@/components/Logo";
import type { SessionPayload } from "@/lib/session";
import type { TrialInfo } from "@/lib/trial";
import { ROL_LABEL, type Rol } from "@/lib/roles";
import { AppNav, type NavItem } from "./AppNav";
import { LogoutButton } from "./LogoutButton";
import { AvisosBar } from "./AvisosBar";

function navFor(rol: Rol, athleteIndividual: boolean): NavItem[] {
  switch (rol) {
    case "DEPORTISTA":
      return athleteIndividual
        ? [
            { href: "/app/mi", label: "Mi control" },
            { href: "/app/mi/evolucion", label: "Mi evolución" },
          ]
        : [{ href: "/app/mi", label: "Mi control" }];
    case "ENTRENADOR":
    case "MEDICO":
      return [{ href: "/app/plantel", label: "Plantel" }];
    case "ADMIN_ORG":
      return [
        { href: "/app/organizacion", label: "Organización" },
        { href: "/app/organizacion/deportistas", label: "Deportistas" },
        { href: "/app/organizacion/usuarios", label: "Usuarios" },
        { href: "/app/plantel", label: "Plantel" },
      ];
    case "ADMIN_CMD":
      return [
        { href: "/app/cmd", label: "Organizaciones" },
        { href: "/app/cmd/mensajes", label: "Mensajes" },
        { href: "/app/plantel", label: "Plantel" },
      ];
  }
}

export function AppShell({
  session,
  athleteIndividual = false,
  trial,
  emailVerificado = true,
  children,
}: {
  session: SessionPayload;
  athleteIndividual?: boolean;
  trial?: TrialInfo;
  emailVerificado?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-mist">
      <header className="relative border-b border-line bg-white">
        <div className="wrap flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/app" aria-label="CMD Insight">
              <Logo height={26} />
            </Link>
            <AppNav items={navFor(session.rol, athleteIndividual)} />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slatey sm:inline">
              {session.nombre} · {ROL_LABEL[session.rol]}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      {trial && (
        <AvisosBar trial={trial} emailVerificado={emailVerificado} />
      )}
      <main className="wrap py-8">{children}</main>
    </div>
  );
}
