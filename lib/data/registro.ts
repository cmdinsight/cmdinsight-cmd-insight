import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api";
import { PERFIL_KEYS, DEFAULT_PERFIL } from "@/lib/score/perfiles";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TRIAL_DIAS = 30;

export interface RegistroInput {
  nombre?: unknown;
  email?: unknown;
  password?: unknown;
  perfil?: unknown;
  acepta?: unknown;
}

function perfilValido(p: unknown): string {
  return typeof p === "string" && (PERFIL_KEYS as string[]).includes(p) ? p : DEFAULT_PERFIL;
}

/**
 * Alta self-serve del plan individual: crea en un paso la organización
 * (tipo INDIVIDUAL, en prueba de 30 días), el usuario DEPORTISTA y su ficha
 * de deportista. Devuelve el usuario para poder abrir sesión.
 */
export async function crearCuentaIndividual(i: RegistroInput) {
  const nombre = String(i.nombre ?? "").trim();
  const email = String(i.email ?? "").toLowerCase().trim();
  const password = String(i.password ?? "");
  const perfil = perfilValido(i.perfil);

  if (nombre.length < 2) throw new ApiError(400, "Ingresá tu nombre.");
  if (!EMAIL_RE.test(email)) throw new ApiError(400, "El email no es válido.");
  if (password.length < 8) throw new ApiError(400, "La contraseña necesita al menos 8 caracteres.");
  if (i.acepta !== true) throw new ApiError(400, "Tenés que aceptar los Términos y la Política de Privacidad.");

  if (await prisma.usuario.findUnique({ where: { email } })) {
    throw new ApiError(409, "Ya existe una cuenta con ese email. Probá acceder.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const trialHasta = new Date(Date.now() + TRIAL_DIAS * 86_400_000);

  const { usuario } = await prisma.$transaction(async (tx) => {
    const org = await tx.organizacion.create({
      data: {
        nombre,
        tipo: "INDIVIDUAL" as never,
        plan: "TRIAL" as never,
        trialHasta,
      },
    });

    const usuario = await tx.usuario.create({
      data: {
        nombre,
        email,
        passwordHash,
        rol: "DEPORTISTA" as never,
        organizacionId: org.id,
      },
    });

    await tx.deportista.create({
      data: {
        nombre,
        organizacionId: org.id,
        usuarioId: usuario.id,
        perfil: perfil as never,
      },
    });

    return { org, usuario };
  });

  return usuario;
}
