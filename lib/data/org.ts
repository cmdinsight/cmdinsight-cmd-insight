import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api";
import type { SessionPayload } from "@/lib/session";
import type { Rol } from "@/lib/roles";

/** Devuelve el orgId sobre el que puede operar la sesión, o lanza 403. */
export function resolveOrgId(session: SessionPayload, requested?: string | null): string {
  if (session.rol === "ADMIN_CMD") {
    if (!requested) throw new ApiError(400, "Falta la organización.");
    return requested;
  }
  if (!session.orgId) throw new ApiError(403, "Tu usuario no pertenece a una organización.");
  if (requested && requested !== session.orgId) throw new ApiError(403, "Sin permiso sobre esa organización.");
  return session.orgId;
}

export async function assertDeportistaEnOrg(deportistaId: string, orgId: string, isCmd: boolean) {
  const d = await prisma.deportista.findUnique({ where: { id: deportistaId } });
  if (!d) throw new ApiError(404, "Deportista no encontrado.");
  if (!isCmd && d.organizacionId !== orgId) throw new ApiError(403, "Sin permiso.");
  return d;
}

export interface DeportistaInput {
  nombre: string;
  posicion?: string | null;
  dorsal?: number | null;
  grupoId?: string | null;
}

export async function crearDeportista(orgId: string, i: DeportistaInput) {
  const nombre = String(i.nombre ?? "").trim();
  if (!nombre) throw new ApiError(400, "El nombre es obligatorio.");
  return prisma.deportista.create({
    data: {
      organizacionId: orgId,
      nombre,
      posicion: i.posicion?.toString().trim() || null,
      dorsal: i.dorsal != null && !Number.isNaN(Number(i.dorsal)) ? Math.round(Number(i.dorsal)) : null,
      grupoId: i.grupoId || null,
    },
  });
}

export async function actualizarDeportista(id: string, i: Partial<DeportistaInput> & { activo?: boolean }) {
  return prisma.deportista.update({
    where: { id },
    data: {
      ...(i.nombre != null ? { nombre: String(i.nombre).trim() } : {}),
      ...(i.posicion !== undefined ? { posicion: i.posicion?.toString().trim() || null } : {}),
      ...(i.dorsal !== undefined
        ? { dorsal: i.dorsal != null && !Number.isNaN(Number(i.dorsal)) ? Math.round(Number(i.dorsal)) : null }
        : {}),
      ...(i.grupoId !== undefined ? { grupoId: i.grupoId || null } : {}),
      ...(i.activo !== undefined ? { activo: !!i.activo } : {}),
    },
  });
}

export interface UsuarioInput {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
  deportistaId?: string | null;
}

const CREATABLE_BY: Record<string, Rol[]> = {
  ADMIN_ORG: ["ENTRENADOR", "MEDICO", "DEPORTISTA"],
  ADMIN_CMD: ["ENTRENADOR", "MEDICO", "DEPORTISTA", "ADMIN_ORG"],
};

export async function crearUsuario(creador: SessionPayload, orgId: string, i: UsuarioInput) {
  const allowed = CREATABLE_BY[creador.rol] ?? [];
  if (!allowed.includes(i.rol)) throw new ApiError(403, "No podés crear ese rol.");

  const nombre = String(i.nombre ?? "").trim();
  const email = String(i.email ?? "").toLowerCase().trim();
  const password = String(i.password ?? "");
  if (!nombre || !email || password.length < 8) {
    throw new ApiError(400, "Nombre, email y contraseña (mínimo 8 caracteres).");
  }
  const existe = await prisma.usuario.findUnique({ where: { email } });
  if (existe) throw new ApiError(409, "Ya existe un usuario con ese email.");

  const passwordHash = await bcrypt.hash(password, 10);
  const usuario = await prisma.usuario.create({
    data: { nombre, email, passwordHash, rol: i.rol, organizacionId: orgId },
  });

  if (i.rol === "DEPORTISTA" && i.deportistaId) {
    await assertDeportistaEnOrg(i.deportistaId, orgId, creador.rol === "ADMIN_CMD");
    await prisma.deportista.update({ where: { id: i.deportistaId }, data: { usuarioId: usuario.id } });
  }

  return usuario;
}

/** CSV: nombre,posicion,dorsal,grupo  (una fila por deportista; encabezado opcional). */
export async function importarDeportistas(orgId: string, csv: string) {
  const lines = csv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) throw new ApiError(400, "El CSV está vacío.");

  const first = lines[0].toLowerCase();
  const start = first.includes("nombre") ? 1 : 0;

  const grupos = await prisma.grupo.findMany({ where: { organizacionId: orgId } });
  const grupoByName = new Map(grupos.map((g) => [g.nombre.toLowerCase(), g.id]));

  let creados = 0;
  const errores: string[] = [];

  for (let idx = start; idx < lines.length; idx++) {
    const cols = lines[idx].split(",").map((c) => c.trim());
    const nombre = cols[0];
    if (!nombre) {
      errores.push(`Fila ${idx + 1}: sin nombre.`);
      continue;
    }
    const posicion = cols[1] || null;
    const dorsal = cols[2] && !Number.isNaN(Number(cols[2])) ? Math.round(Number(cols[2])) : null;
    let grupoId: string | null = null;
    if (cols[3]) {
      const key = cols[3].toLowerCase();
      grupoId = grupoByName.get(key) ?? null;
      if (!grupoId) {
        const g = await prisma.grupo.create({ data: { nombre: cols[3], organizacionId: orgId } });
        grupoByName.set(key, g.id);
        grupoId = g.id;
      }
    }
    await prisma.deportista.create({
      data: { organizacionId: orgId, nombre, posicion, dorsal, grupoId },
    });
    creados++;
  }

  return { creados, errores };
}
