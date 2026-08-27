import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROL_LABEL } from "@/lib/roles";
import { UsuarioForm } from "@/components/app/UsuarioForm";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const s = await requireRole("ADMIN_ORG", "ADMIN_CMD");
  if (!s.orgId) redirect("/app/cmd");

  const [usuarios, deportistasSinUsuario] = await Promise.all([
    prisma.usuario.findMany({
      where: { organizacionId: s.orgId },
      select: { id: true, nombre: true, email: true, rol: true, activo: true },
      orderBy: { nombre: "asc" },
    }),
    prisma.deportista.findMany({
      where: { organizacionId: s.orgId, activo: true, usuarioId: null },
      select: { id: true, nombre: true },
      orderBy: { nombre: "asc" },
    }),
  ]);

  const roles =
    s.rol === "ADMIN_CMD"
      ? (["ENTRENADOR", "MEDICO", "DEPORTISTA", "ADMIN_ORG"] as const)
      : (["ENTRENADOR", "MEDICO", "DEPORTISTA"] as const);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-extrabold text-ink">Usuarios</h1>

      <div className="card mt-6 overflow-hidden">
        <ul className="divide-y divide-line">
          {usuarios.map((u) => (
            <li key={u.id} className="flex items-center justify-between p-4 text-sm">
              <div>
                <div className="font-semibold text-ink">{u.nombre}</div>
                <div className="text-xs text-slatey">{u.email}</div>
              </div>
              <span className="chip">{ROL_LABEL[u.rol as keyof typeof ROL_LABEL] ?? u.rol}</span>
            </li>
          ))}
        </ul>
      </div>

      <h2 className="mt-8 font-display text-lg font-bold text-ink">Nuevo usuario</h2>
      <div className="mt-3">
        <UsuarioForm
          roles={roles.map((r) => ({ value: r, label: ROL_LABEL[r] }))}
          deportistasSinUsuario={deportistasSinUsuario}
        />
      </div>
    </div>
  );
}
