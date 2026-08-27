import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireApi, json, handler, ApiError } from "@/lib/api";

export const runtime = "nodejs";

const TIPOS = new Set(["CLUB", "GIMNASIO", "INDIVIDUAL"]);

export const GET = handler(async () => {
  await requireApi("ADMIN_CMD");
  const orgs = await prisma.organizacion.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { deportistas: true, usuarios: true } } },
  });
  return json({ organizaciones: orgs });
});

export const POST = handler(async (req: NextRequest) => {
  await requireApi("ADMIN_CMD");
  const b = await req.json().catch(() => ({}));

  const nombre = String(b.nombre ?? "").trim();
  const tipo = String(b.tipo ?? "");
  if (!nombre || !TIPOS.has(tipo)) throw new ApiError(400, "Nombre y tipo (CLUB / GIMNASIO / INDIVIDUAL).");

  const adminNombre = String(b.adminNombre ?? "").trim();
  const adminEmail = String(b.adminEmail ?? "").toLowerCase().trim();
  const adminPassword = String(b.adminPassword ?? "");
  if (!adminNombre || !adminEmail || adminPassword.length < 8) {
    throw new ApiError(400, "Datos del administrador de la organización (contraseña mínimo 8).");
  }
  if (await prisma.usuario.findUnique({ where: { email: adminEmail } })) {
    throw new ApiError(409, "Ya existe un usuario con ese email.");
  }

  const org = await prisma.organizacion.create({
    data: {
      nombre,
      tipo: tipo as never,
      plan: b.plan && typeof b.plan === "string" ? (b.plan as never) : "TRIAL",
      cmdCubierta: !!b.cmdCubierta,
      trialHasta: new Date(Date.now() + 30 * 86_400_000),
    },
  });

  await prisma.usuario.create({
    data: {
      nombre: adminNombre,
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      rol: "ADMIN_ORG",
      organizacionId: org.id,
    },
  });

  return json({ ok: true, organizacion: org }, 201);
});
