// Agregados de plantel compartidos por la demo (/demo/panel) y el área real (/app/plantel).

import { dailyLoad, daysAgo } from "@/lib/score/engine";
import type { DailyLog, SpecialEvent } from "@/lib/score/types";

export interface EmergenteEntry {
  id: string;
  nombre: string;
  date: string;
  text: string;
  comentario?: string;
}

interface RosterSource {
  id: string;
  nombre: string;
  dailyLogs: DailyLog[];
  events: SpecialEvent[];
}

export function teamWeeklyLoad(
  players: RosterSource[],
  asOf: string,
  weeks = 5,
): { label: string; value: number }[] {
  const out: { label: string; value: number }[] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    let total = 0;
    for (const p of players) {
      for (const l of p.dailyLogs) {
        const d = daysAgo(l.date, asOf);
        if (d >= w * 7 && d < (w + 1) * 7) total += dailyLoad(l);
      }
    }
    out.push({ label: w === 0 ? "Esta sem." : `-${w}`, value: Math.round(total) });
  }
  return out;
}

export function emergentes(players: RosterSource[], asOf: string, days = 10): EmergenteEntry[] {
  return players
    .flatMap((p) =>
      p.events
        .filter((e) => {
          const d = daysAgo(e.date, asOf);
          return d >= 0 && d < days;
        })
        .map((e) => ({
          id: p.id,
          nombre: p.nombre,
          date: e.date,
          text: e.tipos.join(", "),
          comentario: e.comentario,
        })),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function latestDate(players: RosterSource[], fallback: string): string {
  let max = "";
  for (const p of players) for (const l of p.dailyLogs) if (l.date > max) max = l.date;
  return max || fallback;
}
