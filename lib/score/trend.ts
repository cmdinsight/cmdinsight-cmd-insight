// Análisis de tendencia a 30 días (motor de reglas — spec §6 "predicción por reglas").
// Replica los factores de riesgo que hoy usa la plataforma en producción:
//   increasing_fatigue · rapid_load_increase · frequent_pain
//   multiple_events · poor_sleep · acwr_out_of_range

import type { DailyLog, SpecialEvent } from "./types";
import { computeAcwr, dailyLoad, daysAgo } from "./engine";

export interface TrendFactor {
  key: string;
  label: string;
  detail: string;
}

export interface TrendAnalysis {
  daysAnalyzed: number;
  factors: TrendFactor[];
  /** Frase de lectura rápida para el cuerpo técnico. */
  narrative: string;
}

function mean(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

export function analyzeTrend(
  dailyLogs: DailyLog[],
  events: SpecialEvent[],
  asOf?: string,
): TrendAnalysis {
  const sorted = [...dailyLogs].sort((a, b) => a.date.localeCompare(b.date));
  const cut =
    asOf ??
    (sorted.length ? sorted[sorted.length - 1].date : new Date().toISOString().slice(0, 10));

  const window = sorted.filter((l) => {
    const d = daysAgo(l.date, cut);
    return d >= 0 && d < 30;
  });

  const factors: TrendFactor[] = [];

  if (window.length >= 8) {
    const half = Math.floor(window.length / 2);
    const first = window.slice(0, half);
    const second = window.slice(half);

    // increasing_fatigue — fatiga primera vs segunda mitad
    const f1 = mean(first.map((l) => l.fatiga));
    const f2 = mean(second.map((l) => l.fatiga));
    if (f2 - f1 >= 1.5) {
      factors.push({
        key: "increasing_fatigue",
        label: "Fatiga en aumento",
        detail: `Promedio de fatiga subió de ${f1.toFixed(1)} a ${f2.toFixed(1)} en el período.`,
      });
    }

    // rapid_load_increase — carga media segunda mitad > +20%
    const l1 = mean(first.map(dailyLoad));
    const l2 = mean(second.map(dailyLoad));
    if (l1 > 0 && l2 / l1 - 1 > 0.2) {
      factors.push({
        key: "rapid_load_increase",
        label: "Aumento rápido de carga",
        detail: `Carga media +${Math.round((l2 / l1 - 1) * 100)}% respecto de la primera mitad del período.`,
      });
    }
  }

  // frequent_pain — % de días con dolor > 3/10
  if (window.length >= 7) {
    const painDays = window.filter((l) => l.dolor > 3).length;
    const pct = painDays / window.length;
    if (pct > 0.4) {
      factors.push({
        key: "frequent_pain",
        label: "Dolor frecuente",
        detail: `Dolor > 3/10 en ${Math.round(pct * 100)}% de los días registrados.`,
      });
    }
  }

  // multiple_events — más de 2 eventos en 30 días
  const recentEvents = events.filter((e) => {
    const d = daysAgo(e.date, cut);
    return d >= 0 && d < 30;
  });
  if (recentEvents.length > 2) {
    factors.push({
      key: "multiple_events",
      label: "Eventos múltiples",
      detail: `${recentEvents.length} eventos especiales reportados en los últimos 30 días.`,
    });
  }

  // poor_sleep — sueño reciente bajo (escala 1–5, equivalente a <5/10)
  const last7 = window.filter((l) => daysAgo(l.date, cut) < 7);
  const sleepAvg = mean(last7.map((l) => l.sueno));
  if (last7.length >= 3 && sleepAvg < 2.5) {
    factors.push({
      key: "poor_sleep",
      label: "Mal descanso reciente",
      detail: `Calidad de sueño promedio ${sleepAvg.toFixed(1)}/5 en la última semana.`,
    });
  }

  // acwr_out_of_range — fuera de 0.8–1.5
  const acwr = computeAcwr(sorted, cut);
  if (acwr.ratio !== null && (acwr.ratio < 0.8 || acwr.ratio > 1.5)) {
    factors.push({
      key: "acwr_out_of_range",
      label: "ACWR fuera de rango",
      detail: `Ratio ${acwr.ratio.toFixed(2)} (rango seguro 0.8–1.5).`,
    });
  }

  let narrative: string;
  if (window.length < 7) {
    narrative =
      "Datos insuficientes para análisis de tendencia. Se necesitan al menos 7 días de control diario.";
  } else if (factors.length >= 2) {
    narrative =
      "Riesgo alto de lesión en los próximos 7–10 días: se combinan varios factores de tendencia. Reducir carga y coordinar evaluación médica.";
  } else if (factors.length === 1) {
    narrative =
      "Un factor de tendencia activo. Vigilar de cerca y ajustar la carga en los próximos días.";
  } else {
    narrative = "Tendencia estable en los últimos 30 días. Sin factores de alerta.";
  }

  return { daysAnalyzed: window.length, factors, narrative };
}
