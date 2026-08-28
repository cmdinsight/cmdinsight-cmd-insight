// Motor de score de riesgo de lesión — lógica exacta de la spec §6.
//
// Score total = ACWR (máx 2) + IFS (máx 2) + Dolor (máx 2) + Evento (máx 1)  →  rango 0–7
//
//   0–2  🟢 Riesgo bajo       Entrena normal, sin restricciones
//   3–4  🟡 Riesgo moderado   Vigilar, ajustar carga, recuperación activa
//   5–7  🔴 Riesgo alto       Alta probabilidad de lesión en 7–10 días
//
// El módulo es puro: mismas entradas → mismas salidas (sirve en server y cliente).

import type {
  DailyLog,
  SpecialEvent,
  WeeklyLog,
  PainZone,
  PerfilDeportista,
  RiskColor,
  RiskLevel,
} from "./types";
import { getPerfil } from "./perfiles";

const MS_DAY = 86_400_000;

function toDay(iso: string): number {
  return Math.floor(Date.parse(iso + "T00:00:00Z") / MS_DAY);
}

/** Días de `iso` hacia atrás respecto de `asOf` (0 = mismo día, 1 = ayer…). */
export function daysAgo(iso: string, asOf: string): number {
  return toDay(asOf) - toDay(iso);
}

function sum(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0);
}

function mean(xs: number[]): number {
  return xs.length ? sum(xs) / xs.length : 0;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

/** Carga interna diaria = RPE × minutos. */
export function dailyLoad(l: Pick<DailyLog, "rpe" | "minutes">): number {
  return Math.max(0, l.rpe) * Math.max(0, l.minutes);
}

// ─────────────────────────────────────────────────────────────
// a) ACWR — Carga Aguda : Crónica  (máx 2 pts)
// ─────────────────────────────────────────────────────────────
export interface AcwrResult {
  /** Promedio de carga diaria de los últimos 7 días (divisor fijo 7). */
  acute: number;
  /** Promedio de carga diaria de los últimos 28 días (divisor fijo 28). */
  chronic: number;
  /** acute / chronic — null si no hay historial crónico. */
  ratio: number | null;
  points: number;
  /** Zona óptima de referencia 0.8–1.3. */
  inOptimalZone: boolean;
}

export function computeAcwr(
  logs: DailyLog[],
  asOf: string,
  perfil?: PerfilDeportista,
): AcwrResult {
  const cfg = getPerfil(perfil).acwr;
  const inWindow = (l: DailyLog, n: number) => {
    const d = daysAgo(l.date, asOf);
    return d >= 0 && d < n;
  };
  const acute = sum(logs.filter((l) => inWindow(l, 7)).map(dailyLoad)) / 7;
  const chronic = sum(logs.filter((l) => inWindow(l, 28)).map(dailyLoad)) / 28;
  const ratio = chronic > 0 ? acute / chronic : null;

  let points = 0;
  if (ratio !== null) {
    if (ratio <= cfg.p1) points = 0;
    else if (ratio <= cfg.p2) points = 1;
    else points = 2;
  }
  const inOptimalZone =
    ratio !== null && ratio >= cfg.optimo[0] && ratio <= cfg.optimo[1];
  return { acute, chronic, ratio, points, inOptimalZone };
}

// ─────────────────────────────────────────────────────────────
// b) IFS — Índice de Fatiga Subjetiva  (máx 2 pts)
//    IFS = (Fatiga + Dolor + Estrés) − (Calidad del sueño × 2)
// ─────────────────────────────────────────────────────────────
export interface IfsResult {
  value: number;
  points: number;
}

export function computeIfs(
  l: Pick<DailyLog, "fatiga" | "dolor" | "estres" | "sueno">,
): IfsResult {
  const value = l.fatiga + l.dolor + l.estres - l.sueno * 2;
  const points = value < 10 ? 0 : value < 18 ? 1 : 2;
  return { value, points };
}

// ─────────────────────────────────────────────────────────────
// c) Dolor persistente  (máx 2 pts)
//    Dolor ≥5/10 durante ≥5 días en la misma zona → 2 · ocasional → 1 · sin dolor → 0
// ─────────────────────────────────────────────────────────────
export interface PainResult {
  points: number;
  persistentZone: PainZone | null;
  /** Días con dolor ≥5 en la zona más afectada (ventana de 10 días). */
  persistentDays: number;
  /** Días con dolor ≥3 en la ventana de 10 días (para tendencia). */
  daysWithPain: number;
}

export function computePain(
  logs: DailyLog[],
  asOf: string,
  weekly?: WeeklyLog | null,
  perfil?: PerfilDeportista,
): PainResult {
  const cfg = getPerfil(perfil).dolor;
  const window = logs.filter((l) => {
    const d = daysAgo(l.date, asOf);
    return d >= 0 && d < 10;
  });

  // Para FUERZA, el dolor muscular (DOMS) no cuenta para la persistencia; solo el articular.
  const cuentaParaPersistencia = (l: DailyLog) =>
    l.dolor >= 5 &&
    l.zona !== "Ninguna" &&
    (!cfg.distingueTipo || l.tipoDolor !== "muscular");

  const byZone = new Map<PainZone, number>();
  for (const l of window) {
    if (cuentaParaPersistencia(l)) {
      byZone.set(l.zona, (byZone.get(l.zona) ?? 0) + 1);
    }
  }

  let persistentZone: PainZone | null = null;
  let persistentDays = 0;
  for (const [zone, n] of byZone) {
    if (n > persistentDays) {
      persistentDays = n;
      persistentZone = zone;
    }
  }

  const anyPain = window.some((l) => l.dolor > 0 && l.zona !== "Ninguna");
  const daysWithPain = window.filter((l) => l.dolor >= 3).length;

  let points = 0;
  if (persistentDays >= cfg.diasPersistente || weekly?.dolorPersistente) points = 2;
  else if (anyPain || weekly?.entrenoConDolor) points = 1;

  return {
    points,
    persistentZone: points === 2 ? persistentZone : null,
    persistentDays,
    daysWithPain,
  };
}

// ─────────────────────────────────────────────────────────────
// d) Evento reciente  (máx 1 pt)
// ─────────────────────────────────────────────────────────────
export interface EventResult {
  points: number;
  recent: SpecialEvent[];
}

export function computeEvent(events: SpecialEvent[], asOf: string): EventResult {
  const recent = events.filter((e) => {
    const d = daysAgo(e.date, asOf);
    return d >= 0 && d < 7;
  });
  return { points: recent.length > 0 ? 1 : 0, recent };
}

// ─────────────────────────────────────────────────────────────
// Semáforo
// ─────────────────────────────────────────────────────────────
export interface Semaphore {
  level: RiskLevel;
  color: RiskColor;
  label: string;
  emoji: string;
  significado: string;
  accion: string;
}

export function semaphore(score: number): Semaphore {
  if (score <= 2) {
    return {
      level: "bajo",
      color: "low",
      label: "Riesgo bajo",
      emoji: "🟢",
      significado: "Sin señales de acumulación relevantes.",
      accion: "Entrena normal, sin restricciones.",
    };
  }
  if (score <= 4) {
    return {
      level: "moderado",
      color: "mod",
      label: "Riesgo moderado",
      emoji: "🟡",
      significado: "Hay señales de carga o fatiga acumulada.",
      accion: "Vigilar, ajustar carga y priorizar recuperación activa.",
    };
  }
  return {
    level: "alto",
    color: "high",
    label: "Riesgo alto",
    emoji: "🔴",
    significado: "Alta probabilidad de lesión en 7–10 días.",
    accion: "Reducir carga y coordinar evaluación médica.",
  };
}

// ─────────────────────────────────────────────────────────────
// Regla clínica: riesgo alto (narrativo) si cumple ≥2 criterios
// ─────────────────────────────────────────────────────────────
export interface ClinicalCriterion {
  key: string;
  label: string;
  met: boolean;
}
export interface ClinicalFlag {
  highRisk: boolean;
  metCount: number;
  criteria: ClinicalCriterion[];
}

// ─────────────────────────────────────────────────────────────
// Alertas automáticas del dashboard (spec §7)
// ─────────────────────────────────────────────────────────────
export interface Alert {
  key: string;
  label: string;
  severity: RiskColor;
}

export interface RiskBreakdownItem {
  key: string;
  label: string;
  points: number;
  max: number;
  detail: string;
}

export type Trend = "up" | "down" | "flat";

export interface RiskResult {
  asOf: string;
  perfil: PerfilDeportista;
  score: number;
  acwr: AcwrResult;
  ifs: IfsResult;
  pain: PainResult;
  event: EventResult;
  semaphore: Semaphore;
  breakdown: RiskBreakdownItem[];
  clinical: ClinicalFlag;
  alerts: Alert[];
  todayLoad: number | null;
  latestLog: DailyLog | null;
  trend: Trend;
}

export interface RiskInput {
  dailyLogs: DailyLog[];
  events?: SpecialEvent[];
  weekly?: WeeklyLog | null;
  /** Fecha de corte; por defecto la fecha del último control diario. */
  asOf?: string;
  /** Perfil de deportista; por defecto EQUIPO (modelo de deporte de equipo). */
  perfil?: PerfilDeportista;
}

function latestOnOrBefore(logs: DailyLog[], asOf: string): DailyLog | null {
  let best: DailyLog | null = null;
  for (const l of logs) {
    if (daysAgo(l.date, asOf) < 0) continue;
    if (!best || l.date > best.date) best = l;
  }
  return best;
}

function computeScoreOnly(
  dailyLogs: DailyLog[],
  events: SpecialEvent[],
  weekly: WeeklyLog | null | undefined,
  asOf: string,
  perfil?: PerfilDeportista,
): number {
  const acwr = computeAcwr(dailyLogs, asOf, perfil);
  const latest = latestOnOrBefore(dailyLogs, asOf);
  const ifs = latest ? computeIfs(latest).points : 0;
  const pain = computePain(dailyLogs, asOf, weekly, perfil);
  const event = computeEvent(events, asOf);
  return clamp(acwr.points + ifs + pain.points + event.points, 0, 7);
}

export function computeRisk(input: RiskInput): RiskResult {
  const events = input.events ?? [];
  const perfilCfg = getPerfil(input.perfil);
  const perfil = perfilCfg.key;
  const sorted = [...input.dailyLogs].sort((a, b) => a.date.localeCompare(b.date));
  const asOf =
    input.asOf ??
    (sorted.length ? sorted[sorted.length - 1].date : new Date().toISOString().slice(0, 10));

  const acwr = computeAcwr(sorted, asOf, perfil);
  const latestLog = latestOnOrBefore(sorted, asOf);
  const ifs = latestLog ? computeIfs(latestLog) : { value: 0, points: 0 };
  const pain = computePain(sorted, asOf, input.weekly, perfil);
  const event = computeEvent(events, asOf);

  const score = clamp(acwr.points + ifs.points + pain.points + event.points, 0, 7);
  const sem = semaphore(score);

  const breakdown: RiskBreakdownItem[] = [
    {
      key: "acwr",
      label: "Carga aguda : crónica (ACWR)",
      points: acwr.points,
      max: 2,
      detail:
        acwr.ratio === null
          ? "Sin historial crónico suficiente todavía."
          : `Ratio ${acwr.ratio.toFixed(2)} · aguda ${Math.round(acwr.acute)} vs crónica ${Math.round(
              acwr.chronic,
            )} (óptimo ${perfilCfg.acwr.optimo[0]}–${perfilCfg.acwr.optimo[1]}).`,
    },
    {
      key: "ifs",
      label: "Índice de fatiga subjetiva (IFS)",
      points: ifs.points,
      max: 2,
      detail: latestLog
        ? `IFS ${ifs.value} = (fatiga ${latestLog.fatiga} + dolor ${latestLog.dolor} + estrés ${latestLog.estres}) − sueño ${latestLog.sueno}×2.`
        : "Sin control diario reciente.",
    },
    {
      key: "pain",
      label: "Dolor persistente",
      points: pain.points,
      max: 2,
      detail:
        pain.points === 2
          ? `Dolor ≥5 durante ${pain.persistentDays} días en ${pain.persistentZone}` +
            (perfilCfg.dolor.distingueTipo ? " (dolor articular, no muscular)." : ".")
          : pain.points === 1
            ? "Dolor ocasional reportado."
            : "Sin dolor relevante.",
    },
    {
      key: "event",
      label: "Evento reciente",
      points: event.points,
      max: 1,
      detail: event.recent.length
        ? event.recent
            .flatMap((e) => e.tipos)
            .filter((v, i, a) => a.indexOf(v) === i)
            .join(", ")
        : "Sin eventos en los últimos 7 días.",
    },
  ];

  // Regla clínica ≥2 criterios
  const fatigaAltaMalSueno = !!latestLog && latestLog.fatiga >= 7 && latestLog.sueno <= 2;
  const criteria: ClinicalCriterion[] = [
    {
      key: "acwr",
      label: `ACWR elevado (> ${perfilCfg.acwr.p2})`,
      met: acwr.ratio !== null && acwr.ratio > perfilCfg.acwr.p2,
    },
    { key: "pain", label: "Dolor persistente", met: pain.points === 2 },
    {
      key: "fatiga_sueno",
      label: "Fatiga alta + mal sueño",
      met: fatigaAltaMalSueno,
    },
    { key: "event", label: "Evento especial reciente", met: event.points === 1 },
  ];
  const metCount = criteria.filter((c) => c.met).length;
  const clinical: ClinicalFlag = {
    highRisk: metCount >= 2,
    metCount,
    criteria,
  };

  // Alertas automáticas
  const alerts: Alert[] = [];
  const last3 = sorted.filter((l) => daysAgo(l.date, asOf) < 3 && daysAgo(l.date, asOf) >= 0);
  if (last3.length >= 3 && last3.every((l) => l.dolor >= 7)) {
    alerts.push({ key: "dolor_sostenido", label: "Dolor ≥7 sostenido 3 días", severity: "high" });
  }
  if (fatigaAltaMalSueno) {
    alerts.push({
      key: "fatiga_sueno",
      label: "Fatiga alta + mala calidad de sueño",
      severity: "mod",
    });
  }
  if (acwr.ratio !== null && acwr.ratio > perfilCfg.acwr.p2) {
    alerts.push({ key: "pico_carga", label: "Aumento brusco de carga", severity: "mod" });
  }

  // Tendencia: score de hoy vs score 7 días atrás
  const asOfPrev = new Date(Date.parse(asOf + "T00:00:00Z") - 7 * MS_DAY)
    .toISOString()
    .slice(0, 10);
  const prevScore = computeScoreOnly(sorted, events, input.weekly, asOfPrev, perfil);
  const trend: Trend = score > prevScore ? "up" : score < prevScore ? "down" : "flat";

  const todayLog = sorted.find((l) => daysAgo(l.date, asOf) === 0) ?? null;

  return {
    asOf,
    perfil,
    score,
    acwr,
    ifs,
    pain,
    event,
    semaphore: sem,
    breakdown,
    clinical,
    alerts,
    todayLoad: todayLog ? dailyLoad(todayLog) : null,
    latestLog,
    trend,
  };
}
