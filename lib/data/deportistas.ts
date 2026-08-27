import { prisma } from "@/lib/prisma";
import { computeRisk, type RiskResult } from "@/lib/score/engine";
import { analyzeTrend, type TrendAnalysis } from "@/lib/score/trend";
import type { DailyLog, SpecialEvent, WeeklyLog, SpecialEventType } from "@/lib/score/types";
import { zonaToLabel } from "./zonas";
import type {
  ControlDiario,
  ControlSemanal,
  EventoEspecial,
} from "@prisma/client";

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function mapControl(c: ControlDiario): DailyLog {
  return {
    date: isoDate(c.fecha),
    rpe: c.rpe,
    minutes: c.minutos,
    dolor: c.dolor,
    zona: zonaToLabel(c.zona),
    fatiga: c.fatiga,
    sueno: c.sueno,
    estres: c.estres,
  };
}

export function mapEvento(e: EventoEspecial): SpecialEvent {
  return {
    date: isoDate(e.fecha),
    tipos: e.tipos as SpecialEventType[],
    comentario: e.comentario ?? undefined,
  };
}

export function mapSemanal(w: ControlSemanal): WeeklyLog {
  return {
    weekStart: isoDate(w.semanaInicio),
    dolorPersistente: w.dolorPersistente,
    dolorLimitoRendimiento: w.dolorLimitoRendimiento,
    piernasPesadas: w.piernasPesadas,
    horasSueno: w.horasSueno,
    entrenoConDolor: w.entrenoConDolor,
  };
}

export interface DeportistaConRiesgo {
  id: string;
  nombre: string;
  posicion: string | null;
  dorsal: number | null;
  grupo: string | null;
  dailyLogs: DailyLog[];
  events: SpecialEvent[];
  risk: RiskResult;
  trend: TrendAnalysis;
}

/** Plantel de una organización con el score de cada deportista. */
export async function listRosterWithRisk(
  organizacionId: string,
  grupoId?: string | null,
): Promise<DeportistaConRiesgo[]> {
  const deportistas = await prisma.deportista.findMany({
    where: {
      organizacionId,
      activo: true,
      ...(grupoId ? { grupoId } : {}),
    },
    include: {
      grupo: true,
      controles: { orderBy: { fecha: "asc" } },
      eventos: true,
      semanales: { orderBy: { semanaInicio: "desc" }, take: 1 },
    },
    orderBy: { nombre: "asc" },
  });

  return deportistas.map((d) => {
    const dailyLogs = d.controles.map(mapControl);
    const events = d.eventos.map(mapEvento);
    const weekly = d.semanales[0] ? mapSemanal(d.semanales[0]) : null;
    return {
      id: d.id,
      nombre: d.nombre,
      posicion: d.posicion,
      dorsal: d.dorsal,
      grupo: d.grupo?.nombre ?? null,
      dailyLogs,
      events,
      risk: computeRisk({ dailyLogs, events, weekly }),
      trend: analyzeTrend(dailyLogs, events),
    };
  });
}

export type DeportistaFull = NonNullable<Awaited<ReturnType<typeof getDeportistaFull>>>;

export async function getDeportistaFull(id: string) {
  const d = await prisma.deportista.findUnique({
    where: { id },
    include: {
      organizacion: true,
      grupo: true,
      usuario: true,
      fichaMedica: true,
      controles: { orderBy: { fecha: "asc" } },
      eventos: { orderBy: { fecha: "desc" } },
      semanales: { orderBy: { semanaInicio: "desc" } },
    },
  });
  if (!d) return null;

  const dailyLogs = d.controles.map(mapControl);
  const events = d.eventos.map(mapEvento);
  const weekly = d.semanales[0] ? mapSemanal(d.semanales[0]) : null;

  return {
    ...d,
    dailyLogs,
    events,
    weekly,
    risk: computeRisk({ dailyLogs, events, weekly }),
    trend: analyzeTrend(dailyLogs, events),
  };
}

/** Deportista vinculado al usuario logueado (rol DEPORTISTA). */
export async function getMiDeportista(usuarioId: string) {
  const d = await prisma.deportista.findFirst({ where: { usuarioId } });
  if (!d) return null;
  return getDeportistaFull(d.id);
}
