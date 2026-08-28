// Conducta preventiva sugerida a partir del score y sus factores.
// Pensado para el cuerpo técnico y el médico: acciones concretas, no solo el número.

import type { RiskResult } from "./engine";
import type { TrendAnalysis } from "./trend";
import type { PerfilDeportista } from "./types";
import { getPerfil } from "./perfiles";

export type Prioridad = "alta" | "media" | "baja";

// Cómo se nombra "bajar la carga" según la disciplina.
const ACCION_CARGA: Record<PerfilDeportista, { que: string; como: string }> = {
  EQUIPO: { que: "la carga", como: "Evitar sesiones de alta intensidad en días consecutivos y espaciar los picos." },
  CORREDOR: { que: "el kilometraje", como: "Bajar volumen, evitar cuestas y asfalto duro, sumar días de trote suave o descanso." },
  CICLISTA: { que: "el volumen (horas / desnivel)", como: "Salidas más cortas y llanas, sin bloques de alta intensidad seguidos." },
  TRIATLETA: { que: "el volumen total", como: "Recortar sobre todo la carga de corrida, que es la de mayor impacto." },
  FUERZA: { que: "el tonelaje / volumen", como: "Sacar el trabajo al fallo, bajar series o carga, priorizar técnica y rango completo." },
  FITNESS: { que: "el volumen de entrenamiento", como: "Menos sesiones o más suaves esta semana, sin buscar el agotamiento." },
};

export interface Recomendacion {
  prioridad: Prioridad;
  titulo: string;
  detalle: string;
  categoria: "carga" | "dolor" | "recuperacion" | "evento" | "tendencia" | "general";
}

const ORDEN: Record<Prioridad, number> = { alta: 0, media: 1, baja: 2 };

export function recomendaciones(
  risk: RiskResult,
  trend?: TrendAnalysis,
): Recomendacion[] {
  const items: Recomendacion[] = [];
  const nivel = risk.semaphore.level;
  const latest = risk.latestLog;
  const perfilCfg = getPerfil(risk.perfil);
  const carga = ACCION_CARGA[perfilCfg.key];

  // Encabezado según nivel
  if (nivel === "alto") {
    items.push({
      prioridad: "alta",
      categoria: "general",
      titulo: "Reunión cuerpo técnico + médico en las próximas 24 h",
      detalle:
        "El score indica alta probabilidad de lesión en 7–10 días. Definir un plan de carga individualizado, acordar restricciones y reevaluar en 48 h.",
    });
  } else if (nivel === "moderado") {
    items.push({
      prioridad: "media",
      categoria: "general",
      titulo: "Vigilancia activa esta semana",
      detalle:
        "Ajustar la carga, sumar recuperación activa y reevaluar en 72 h. Chequear con el deportista sensaciones, sueño y molestias.",
    });
  }

  // ACWR — carga aguda:crónica
  if (risk.acwr.ratio !== null && risk.acwr.ratio > perfilCfg.acwr.p1) {
    const alto = risk.acwr.ratio > perfilCfg.acwr.p2;
    const pct = Math.round((risk.acwr.ratio - 1) * 100);
    items.push({
      prioridad: alto ? "alta" : "media",
      categoria: "carga",
      titulo: `Reducir ${carga.que} ${alto ? "30–40%" : "20–30%"} esta semana`,
      detalle: `La carga aguda está ${pct}% por encima de la crónica (ACWR ${risk.acwr.ratio.toFixed(
        2,
      )}, zona óptima ${perfilCfg.acwr.optimo[0]}–${perfilCfg.acwr.optimo[1]}). ${carga.como}`,
    });
  } else if (risk.acwr.ratio !== null && risk.acwr.ratio < perfilCfg.acwr.optimo[0]) {
    items.push({
      prioridad: "baja",
      categoria: "carga",
      titulo: "Reintroducir carga de forma gradual",
      detalle: `ACWR ${risk.acwr.ratio.toFixed(
        2,
      )}: viene de un período de baja carga. Volver al volumen habitual con incrementos ≤ 10% por semana para no generar un pico.`,
    });
  }

  // Dolor persistente
  if (risk.pain.points === 2) {
    items.push({
      prioridad: "alta",
      categoria: "dolor",
      titulo: `Evaluación médica / kinesiológica de ${risk.pain.persistentZone ?? "la zona afectada"}`,
      detalle: perfilCfg.dolor.distingueTipo
        ? `Dolor articular ≥ 5/10 sostenido ${risk.pain.persistentDays} días en la misma zona (no es el dolor muscular esperable post-entreno). Descargar esa articulación, revisar técnica y consultar si no cede en 5–7 días.`
        : `Dolor ≥ 5/10 sostenido ${risk.pain.persistentDays} días en la misma zona: patrón asociado a lesión por sobrecarga. No entrenar esa zona a intensidad; si no cede en 5–7 días, considerar estudio por imágenes.`,
    });
  } else if (risk.pain.points === 1) {
    items.push({
      prioridad: "baja",
      categoria: "dolor",
      titulo: "Seguimiento de la molestia reportada",
      detalle:
        "Dolor ocasional. Confirmar zona y mecanismo, trabajo de movilidad/activación y control del dolor en cada sesión.",
    });
  }

  // Fatiga + sueño
  if (latest && latest.fatiga >= 7 && latest.sueno <= 2) {
    items.push({
      prioridad: "media",
      categoria: "recuperacion",
      titulo: "Priorizar recuperación 24–48 h",
      detalle: `Fatiga ${latest.fatiga}/10 con sueño ${latest.sueno}/5. Sesión regenerativa o descanso, higiene del sueño, hidratación y nutrición. Revisar carga académica/laboral y estrés externo.`,
    });
  } else if (risk.ifs.points === 2) {
    items.push({
      prioridad: "media",
      categoria: "recuperacion",
      titulo: "Bajar la exigencia de las próximas sesiones",
      detalle: `Índice de fatiga subjetiva alto (IFS ${risk.ifs.value}): la combinación de fatiga, dolor y estrés no está compensada por el descanso.`,
    });
  }

  // Evento reciente
  if (risk.event.recent.length > 0) {
    const tipos = risk.event.recent
      .flatMap((e) => e.tipos)
      .filter((v, i, a) => a.indexOf(v) === i);
    items.push({
      prioridad: "media",
      categoria: "evento",
      titulo: "Seguimiento clínico del evento reciente",
      detalle: `Reportó: ${tipos.join(
        ", ",
      )}. Confirmar mecanismo lesional, hacer test funcional y no retornar a intensidad plena sin evaluación.`,
    });
  }

  // Tendencia 30 días (solo si aporta algo no cubierto)
  if (trend && trend.factors.length >= 2) {
    items.push({
      prioridad: "media",
      categoria: "tendencia",
      titulo: "Revisar la planificación del mesociclo",
      detalle: `${trend.factors.length} factores de tendencia activos en los últimos 30 días: ${trend.factors
        .map((f) => f.label.toLowerCase())
        .join(", ")}.`,
    });
  }

  if (items.length === 0) {
    items.push({
      prioridad: "baja",
      categoria: "general",
      titulo: "Sin restricciones — mantener monitoreo",
      detalle:
        "No hay señales de acumulación. Buen momento para trabajo de fuerza preventiva y para consolidar cargas.",
    });
  }

  return items.sort((a, b) => ORDEN[a.prioridad] - ORDEN[b.prioridad]);
}

/** Una línea de acción para listar en el dashboard de plantel. */
export function resumenConducta(risk: RiskResult): string {
  return recomendaciones(risk)[0]?.titulo ?? risk.semaphore.accion;
}
