import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireApi, json, handler, ApiError } from "@/lib/api";
import { getRoster } from "@/lib/demo/data";
import { labelToZona } from "@/lib/data/zonas";

export const runtime = "nodejs";
export const maxDuration = 60;

const ORG_NOMBRE = "Club Demo CMD";

export const POST = handler(async (req: NextRequest) => {
  await requireApi("ADMIN_CMD");
  const b = await req.json().catch(() => ({}));
  const password = String(b.password ?? "demo12345");
  if (password.length < 8) throw new ApiError(400, "La contraseña de las cuentas demo debe tener 8+ caracteres.");

  if (await prisma.organizacion.findFirst({ where: { nombre: ORG_NOMBRE } })) {
    throw new ApiError(409, `Ya existe la organización "${ORG_NOMBRE}". Borrala antes de recrear los datos demo.`);
  }

  const roster = getRoster();
  const passwordHash = await bcrypt.hash(password, 10);

  const org = await prisma.organizacion.create({
    data: { nombre: ORG_NOMBRE, tipo: "CLUB", plan: "CORTESIA_CMD", cmdCubierta: true },
  });
  const grupo = await prisma.grupo.create({ data: { nombre: "Primera", organizacionId: org.id } });

  let firstDeportistaId = "";

  for (const p of roster) {
    const dep = await prisma.deportista.create({
      data: {
        organizacionId: org.id,
        grupoId: grupo.id,
        nombre: p.nombre,
        posicion: p.posicion,
        dorsal: p.dorsal,
      },
    });
    if (!firstDeportistaId) firstDeportistaId = dep.id;

    await prisma.controlDiario.createMany({
      data: p.dailyLogs.map((l) => ({
        deportistaId: dep.id,
        fecha: new Date(l.date + "T00:00:00Z"),
        rpe: l.rpe,
        minutos: l.minutes,
        dolor: l.dolor,
        zona: labelToZona(l.zona) as never,
        fatiga: l.fatiga,
        sueno: l.sueno,
        estres: l.estres,
      })),
    });

    if (p.events.length > 0) {
      await prisma.eventoEspecial.createMany({
        data: p.events.map((e) => ({
          deportistaId: dep.id,
          fecha: new Date(e.date + "T00:00:00Z"),
          tipos: e.tipos,
          comentario: e.comentario ?? null,
        })),
      });
    }
  }

  await prisma.usuario.createMany({
    data: [
      { nombre: "Entrenador Demo", email: "entrenador.demo@cmdinsight.app", passwordHash, rol: "ENTRENADOR", organizacionId: org.id },
      { nombre: "Médico Demo", email: "medico.demo@cmdinsight.app", passwordHash, rol: "MEDICO", organizacionId: org.id },
      { nombre: "Admin Club Demo", email: "adminclub.demo@cmdinsight.app", passwordHash, rol: "ADMIN_ORG", organizacionId: org.id },
    ],
    skipDuplicates: true,
  });

  const deportistaUser = await prisma.usuario.upsert({
    where: { email: "deportista.demo@cmdinsight.app" },
    create: { nombre: "Deportista Demo", email: "deportista.demo@cmdinsight.app", passwordHash, rol: "DEPORTISTA", organizacionId: org.id },
    update: {},
  });
  await prisma.deportista.update({ where: { id: firstDeportistaId }, data: { usuarioId: deportistaUser.id } });

  return json({
    ok: true,
    organizacion: org.nombre,
    deportistas: roster.length,
    cuentas: {
      entrenador: "entrenador.demo@cmdinsight.app",
      medico: "medico.demo@cmdinsight.app",
      adminOrg: "adminclub.demo@cmdinsight.app",
      deportista: "deportista.demo@cmdinsight.app",
      password,
    },
  });
});
