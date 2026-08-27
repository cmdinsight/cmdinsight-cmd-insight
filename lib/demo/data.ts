// Datos demo del panel: un plantel ficticio con historial simulado de 35 días.
// Todo es determinístico (PRNG con semilla) para que server y cliente coincidan.
// Los scores NO están hardcodeados: salen de pasar estos datos por computeRisk().

import type { DailyLog, PainZone, SpecialEvent, SpecialEventType } from "@/lib/score/types";
import { computeRisk, type RiskResult } from "@/lib/score/engine";
import { analyzeTrend, type TrendAnalysis } from "@/lib/score/trend";

export const DEMO_AS_OF = "2026-08-25";
export const DEMO_TEAM = "Plantel Primera · Club Demo CMD";
const HISTORY_DAYS = 35;

type Profile = "estable" | "carga_alta" | "fatiga_acumulada" | "dolor_persistente" | "post_golpe";

interface Seed {
  id: string;
  nombre: string;
  posicion: string;
  categoria: string;
  dorsal: number;
  profile: Profile;
  zona?: PainZone;
  seed: number;
}

const SEEDS: Seed[] = [
  { id: "l-suarez", nombre: "Leandro Suárez", posicion: "Delantero", categoria: "Primera", dorsal: 9, profile: "dolor_persistente", zona: "Isquiotibiales", seed: 101 },
  { id: "m-cardozo", nombre: "Matías Cardozo", posicion: "Volante", categoria: "Primera", dorsal: 8, profile: "carga_alta", seed: 102 },
  { id: "f-rodriguez", nombre: "Franco Rodríguez", posicion: "Lateral", categoria: "Primera", dorsal: 4, profile: "post_golpe", zona: "Tobillo", seed: 103 },
  { id: "n-benitez", nombre: "Nicolás Benítez", posicion: "Central", categoria: "Primera", dorsal: 2, profile: "fatiga_acumulada", seed: 104 },
  { id: "j-pereira", nombre: "Joaquín Pereira", posicion: "Volante", categoria: "Primera", dorsal: 5, profile: "estable", seed: 105 },
  { id: "d-gimenez", nombre: "Diego Giménez", posicion: "Delantero", categoria: "Primera", dorsal: 11, profile: "carga_alta", seed: 106 },
  { id: "a-fernandez", nombre: "Agustín Fernández", posicion: "Arquero", categoria: "Primera", dorsal: 1, profile: "estable", seed: 107 },
  { id: "s-methol", nombre: "Santiago Méthol", posicion: "Lateral", categoria: "Primera", dorsal: 3, profile: "estable", seed: 108 },
  { id: "r-olivera", nombre: "Rodrigo Olivera", posicion: "Central", categoria: "Primera", dorsal: 6, profile: "dolor_persistente", zona: "Rodilla", seed: 109 },
  { id: "b-silva", nombre: "Bruno Silva", posicion: "Volante", categoria: "Primera", dorsal: 10, profile: "fatiga_acumulada", seed: 110 },
  { id: "t-acosta", nombre: "Tomás Acosta", posicion: "Delantero", categoria: "Primera", dorsal: 7, profile: "estable", seed: 111 },
  { id: "e-nunez", nombre: "Emiliano Núñez", posicion: "Lateral", categoria: "Primera", dorsal: 15, profile: "estable", seed: 112 },
  { id: "g-cabrera", nombre: "Gonzalo Cabrera", posicion: "Central", categoria: "Primera", dorsal: 13, profile: "carga_alta", seed: 113 },
  { id: "i-vera", nombre: "Ignacio Vera", posicion: "Volante", categoria: "Primera", dorsal: 14, profile: "estable", seed: 114 },
];

// PRNG determinístico (mulberry32)
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function isoMinus(base: string, days: number): string {
  return new Date(Date.parse(base + "T00:00:00Z") - days * 86_400_000).toISOString().slice(0, 10);
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, Math.round(n)));
}

function profileParams(profile: Profile, dayFromEnd: number, rand: () => number) {
  // dayFromEnd: 0 = hoy, crece hacia el pasado. La "presión" se concentra en la última semana.
  const recent = dayFromEnd < 7;
  const midRecent = dayFromEnd < 14;
  const n = () => rand() * 2 - 1; // ruido -1..1

  switch (profile) {
    case "estable":
      return { rpe: 5 + n(), minutes: 80 + n() * 8, dolor: Math.max(0, 0.4 + n()), fatiga: 3 + n(), sueno: 4 + n() * 0.6, estres: 2 + n() };
    case "carga_alta":
      return {
        rpe: (recent ? 8.6 : midRecent ? 6.2 : 4.4) + n(),
        minutes: (recent ? 108 : 76) + n() * 8,
        dolor: Math.max(0, (recent ? 2.6 : 0.8) + n()),
        fatiga: (recent ? 6.6 : 3.6) + n(),
        sueno: (recent ? 3 : 4) + n() * 0.5,
        estres: (recent ? 4.6 : 2.6) + n(),
      };
    case "fatiga_acumulada":
      return {
        rpe: (recent ? 7.2 : 6) + n(),
        minutes: (recent ? 96 : 84) + n() * 8,
        dolor: Math.max(0, (recent ? 3.2 : 1.4) + n()),
        fatiga: (recent ? 8.6 : midRecent ? 6.8 : 5) + n(),
        sueno: (recent ? 1.8 : 3) + n() * 0.5,
        estres: (recent ? 7.2 : 4) + n(),
      };
    case "dolor_persistente":
      return {
        rpe: (recent ? 8 : midRecent ? 6.2 : 5.2) + n(),
        minutes: (recent ? 100 : 82) + n() * 8,
        dolor: (dayFromEnd < 9 ? 6.6 : 2.4) + n(),
        fatiga: (recent ? 8.6 : 5) + n(),
        sueno: (recent ? 1.6 : 3.4) + n() * 0.5,
        estres: (recent ? 7.4 : 3.4) + n(),
      };
    case "post_golpe":
      return {
        rpe: (recent ? 8.2 : 5.8) + n(),
        minutes: (recent ? 98 : 82) + n() * 8,
        dolor: (dayFromEnd < 7 ? 6.8 : dayFromEnd < 10 ? 3 : 1) + n(),
        fatiga: (recent ? 7.8 : 4.4) + n(),
        sueno: (recent ? 2 : 3.8) + n() * 0.5,
        estres: (recent ? 6 : 3) + n(),
      };
  }
}

function buildLogs(s: Seed): DailyLog[] {
  const rand = rng(s.seed);
  const logs: DailyLog[] = [];
  for (let d = HISTORY_DAYS - 1; d >= 0; d--) {
    const dow = new Date(Date.parse(DEMO_AS_OF + "T00:00:00Z") - d * 86_400_000).getUTCDay();
    // domingo casi siempre descanso; los formularios se llenan igual con RPE bajo
    const isRest = dow === 0 && rand() > 0.2;
    const p = profileParams(s.profile, d, rand);
    const hasPain = p.dolor >= 1.5;
    logs.push({
      date: isoMinus(DEMO_AS_OF, d),
      rpe: isRest ? clamp(1 + rand() * 1.5, 0, 10) : clamp(p.rpe, 2, 10),
      minutes: isRest ? clamp(20 + rand() * 15, 0, 200) : clamp(p.minutes, 30, 130),
      dolor: clamp(p.dolor, 0, 10),
      zona: hasPain && s.zona ? s.zona : hasPain ? "Cuádriceps" : "Ninguna",
      fatiga: clamp(p.fatiga, 0, 10),
      sueno: clamp(p.sueno, 1, 5),
      estres: clamp(p.estres, 0, 10),
    });
  }
  return logs;
}

function buildEvents(s: Seed): SpecialEvent[] {
  if (s.profile === "post_golpe") {
    return [{ date: isoMinus(DEMO_AS_OF, 4), tipos: ["Golpe fuerte"] as SpecialEventType[], comentario: "Choque en disputa aérea, molestia en tobillo." }];
  }
  if (s.profile === "dolor_persistente" && s.id === "l-suarez") {
    return [{ date: isoMinus(DEMO_AS_OF, 6), tipos: ["Molestia de lesión previa"] as SpecialEventType[], comentario: "Vuelve a molestar el isquio del año pasado." }];
  }
  if (s.profile === "carga_alta" && s.id === "d-gimenez") {
    return [{ date: isoMinus(DEMO_AS_OF, 3), tipos: ["Calambres repetidos"] as SpecialEventType[] }];
  }
  return [];
}

export interface DemoPlayer {
  id: string;
  nombre: string;
  posicion: string;
  categoria: string;
  dorsal: number;
  dailyLogs: DailyLog[];
  weekly: null;
  events: SpecialEvent[];
  risk: RiskResult;
  trend: TrendAnalysis;
}

let cache: DemoPlayer[] | null = null;

export function getRoster(): DemoPlayer[] {
  if (cache) return cache;
  cache = SEEDS.map((s) => {
    const dailyLogs = buildLogs(s);
    const events = buildEvents(s);
    const risk = computeRisk({ dailyLogs, events, asOf: DEMO_AS_OF });
    const trend = analyzeTrend(dailyLogs, events, DEMO_AS_OF);
    return {
      id: s.id,
      nombre: s.nombre,
      posicion: s.posicion,
      categoria: s.categoria,
      dorsal: s.dorsal,
      dailyLogs,
      weekly: null,
      events,
      risk,
      trend,
    };
  });
  return cache;
}

export function getPlayer(id: string): DemoPlayer | undefined {
  return getRoster().find((p) => p.id === id);
}

// El deportista "logueado" en la demo del formulario (Formulario 1/2/3).
export const DEMO_ATHLETE_ID = "j-pereira";
