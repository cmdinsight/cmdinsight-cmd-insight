// Escenarios de referencia para explicar el motor de riesgo de forma transparente.
// Se calculan en vivo con computeRisk() en la página "Cómo funciona".

import type { DailyLog, SpecialEvent } from "./types";

export interface WorkedExample {
  id: string;
  title: string;
  summary: string;
  dailyLogs: DailyLog[];
  events: SpecialEvent[];
  asOf: string;
}

// Genera N días de carga estable terminando en `end`.
function steady(
  end: string,
  days: number,
  base: Partial<DailyLog>,
): DailyLog[] {
  const out: DailyLog[] = [];
  const endMs = Date.parse(end + "T00:00:00Z");
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(endMs - i * 86_400_000).toISOString().slice(0, 10);
    out.push({
      date,
      rpe: 5,
      minutes: 80,
      dolor: 0,
      zona: "Ninguna",
      fatiga: 3,
      sueno: 4,
      estres: 2,
      ...base,
    });
  }
  return out;
}

const END = "2026-03-20";

export const WORKED_EXAMPLES: WorkedExample[] = [
  {
    id: "verde",
    title: "Semana limpia",
    summary:
      "Carga estable, sin dolor, buen descanso. ACWR en zona óptima, IFS bajo. Score esperado 0–2 (verde).",
    dailyLogs: steady(END, 28, {}),
    events: [],
    asOf: END,
  },
  {
    id: "amarillo",
    title: "Carga en aumento + fatiga",
    summary:
      "Tres semanas suaves y una semana fuerte: la carga aguda se dispara sobre la crónica y sube la fatiga. Score esperado 3–4 (amarillo).",
    dailyLogs: [
      ...steady(
        new Date(Date.parse(END + "T00:00:00Z") - 7 * 86_400_000)
          .toISOString()
          .slice(0, 10),
        21,
        { rpe: 4, minutes: 70 },
      ),
      ...steady(END, 7, { rpe: 8, minutes: 100, fatiga: 7, estres: 5, sueno: 3 }),
    ],
    events: [],
    asOf: END,
  },
  {
    id: "rojo",
    title: "Dolor persistente + evento",
    summary:
      "Dolor ≥5 en el mismo isquiotibial durante más de 5 días, mal sueño, fatiga alta y un tirón reportado. Cumple 3 de 4 criterios clínicos. Score esperado 5–7 (rojo).",
    dailyLogs: [
      ...steady(
        new Date(Date.parse(END + "T00:00:00Z") - 8 * 86_400_000)
          .toISOString()
          .slice(0, 10),
        20,
        { rpe: 6, minutes: 85 },
      ),
      ...steady(END, 8, {
        rpe: 8,
        minutes: 95,
        dolor: 6,
        zona: "Isquiotibiales",
        fatiga: 8,
        sueno: 2,
        estres: 6,
      }),
    ],
    events: [
      { date: END, tipos: ["Tirón muscular"], comentario: "Molestia al pique." },
    ],
    asOf: END,
  },
];
