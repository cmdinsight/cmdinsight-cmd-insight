import { prisma } from "@/lib/prisma";
import { labelToZona } from "./zonas";
import { getDeportistaFull } from "./deportistas";
import type { PainZone } from "@/lib/score/types";
import { ApiError } from "@/lib/api";

function day(dateISO: string): Date {
  const d = new Date(dateISO + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) throw new ApiError(400, "Fecha inválida.");
  return d;
}

function int(v: unknown, lo: number, hi: number, label: string): number {
  const n = Math.round(Number(v));
  if (Number.isNaN(n) || n < lo || n > hi) throw new ApiError(400, `${label} fuera de rango.`);
  return n;
}

export interface DailyInput {
  date: string;
  rpe: number;
  minutes: number;
  dolor: number;
  zona: PainZone;
  fatiga: number;
  sueno: number;
  estres: number;
}

export async function saveControlDiario(deportistaId: string, i: DailyInput) {
  const fecha = day(i.date);
  const data = {
    rpe: int(i.rpe, 0, 10, "RPE"),
    minutos: int(i.minutes, 1, 400, "Duración"),
    dolor: int(i.dolor, 0, 10, "Dolor"),
    zona: labelToZona(i.zona) as any,
    fatiga: int(i.fatiga, 0, 10, "Fatiga"),
    sueno: int(i.sueno, 1, 5, "Sueño"),
    estres: int(i.estres, 0, 10, "Estrés"),
  };
  await prisma.controlDiario.upsert({
    where: { deportistaId_fecha: { deportistaId, fecha } },
    create: { deportistaId, fecha, ...data },
    update: data,
  });
  return recompute(deportistaId);
}

export interface WeeklyInput {
  weekStart: string;
  dolorPersistente: boolean;
  dolorLimitoRendimiento: boolean;
  piernasPesadas: number;
  horasSueno: number;
  entrenoConDolor: boolean;
}

export async function saveControlSemanal(deportistaId: string, i: WeeklyInput) {
  const semanaInicio = day(i.weekStart);
  const horas = Number(i.horasSueno);
  if (Number.isNaN(horas) || horas <= 0 || horas > 16) throw new ApiError(400, "Horas de sueño inválidas.");
  const data = {
    dolorPersistente: !!i.dolorPersistente,
    dolorLimitoRendimiento: !!i.dolorLimitoRendimiento,
    piernasPesadas: int(i.piernasPesadas, 0, 10, "Piernas pesadas"),
    horasSueno: horas,
    entrenoConDolor: !!i.entrenoConDolor,
  };
  await prisma.controlSemanal.upsert({
    where: { deportistaId_semanaInicio: { deportistaId, semanaInicio } },
    create: { deportistaId, semanaInicio, ...data },
    update: data,
  });
  return recompute(deportistaId);
}

export interface EventInput {
  date: string;
  tipos: string[];
  comentario?: string | null;
  registradoPor?: string | null;
}

const EVENT_TYPES = new Set([
  "Golpe fuerte",
  "Tirón muscular",
  "Sobrecarga progresiva",
  "Calambres repetidos",
  "Molestia de lesión previa",
  "Otro",
]);

export async function saveEvento(deportistaId: string, i: EventInput) {
  const fecha = day(i.date);
  const tipos = (i.tipos ?? []).filter((t) => EVENT_TYPES.has(t));
  if (tipos.length === 0) throw new ApiError(400, "Marcá al menos un tipo de evento.");
  await prisma.eventoEspecial.create({
    data: {
      deportistaId,
      fecha,
      tipos,
      comentario: i.comentario?.toString().trim() || null,
      registradoPor: i.registradoPor ?? null,
    },
  });
  return recompute(deportistaId);
}

async function recompute(deportistaId: string) {
  const full = await getDeportistaFull(deportistaId);
  return full?.risk ?? null;
}
