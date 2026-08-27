// Estado local del deportista en la demo (no hay backend real).
// Se guarda en localStorage del navegador — privado de ese dispositivo.

import type { DailyLog, WeeklyLog, SpecialEvent } from "@/lib/score/types";
import { getPlayer, DEMO_ATHLETE_ID } from "@/lib/demo/data";

const KEY = "cmd-insight-demo-v1";

export interface LocalState {
  daily: DailyLog[];
  weekly: WeeklyLog[];
  events: SpecialEvent[];
}

const EMPTY: LocalState = { daily: [], weekly: [], events: [] };

export function loadState(): LocalState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<LocalState>;
    return {
      daily: parsed.daily ?? [],
      weekly: parsed.weekly ?? [],
      events: parsed.events ?? [],
    };
  } catch {
    return EMPTY;
  }
}

export function saveState(s: LocalState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* almacenamiento no disponible */
  }
}

export function addDaily(log: DailyLog) {
  const s = loadState();
  s.daily = [...s.daily.filter((d) => d.date !== log.date), log];
  saveState(s);
}

export function addWeekly(log: WeeklyLog) {
  const s = loadState();
  s.weekly = [...s.weekly.filter((w) => w.weekStart !== log.weekStart), log];
  saveState(s);
}

export function addEvent(e: SpecialEvent) {
  const s = loadState();
  s.events = [...s.events, e];
  saveState(s);
}

export function resetState() {
  saveState({ daily: [], weekly: [], events: [] });
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function weekStartISO(d = new Date()): string {
  const day = d.getUTCDay(); // 0 dom
  const diff = (day + 6) % 7; // lunes como inicio
  return new Date(d.getTime() - diff * 86_400_000).toISOString().slice(0, 10);
}

/** Historial base (deportista demo) + entradas locales; las locales pisan por fecha. */
export function effectiveAthleteData(): {
  dailyLogs: DailyLog[];
  weekly: WeeklyLog | null;
  events: SpecialEvent[];
} {
  const base = getPlayer(DEMO_ATHLETE_ID);
  const local = loadState();

  const byDate = new Map<string, DailyLog>();
  for (const l of base?.dailyLogs ?? []) byDate.set(l.date, l);
  for (const l of local.daily) byDate.set(l.date, l);
  const dailyLogs = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));

  const weekly =
    local.weekly.length > 0
      ? [...local.weekly].sort((a, b) => b.weekStart.localeCompare(a.weekStart))[0]
      : null;

  const events = [...(base?.events ?? []), ...local.events];

  return { dailyLogs, weekly, events };
}
