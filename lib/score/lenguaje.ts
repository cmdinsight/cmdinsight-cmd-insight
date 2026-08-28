// Lenguaje "simple": traduce las etiquetas técnicas del score a algo que un
// deportista individual (sin cuerpo médico detrás) pueda leer sin jerga.
// El motor (engine.ts) sigue siendo la fuente de la verdad; esto es solo capa
// de presentación para /app/mi y la demo del deportista.

import type { RiskResult } from "./engine";

export interface FactorSimple {
  titulo: string;
  queEs: string;
}

/** Título + explicación en criollo para cada sub-score, por `key` del breakdown. */
export const FACTOR_SIMPLE: Record<string, FactorSimple> = {
  acwr: {
    titulo: "Tu carga de entrenamiento",
    queEs:
      "Compara lo que entrenaste esta última semana con lo que venís haciendo habitualmente. Si subís muy rápido, sube el riesgo.",
  },
  ifs: {
    titulo: "Cómo venís de cuerpo y cabeza",
    queEs:
      "Junta tu fatiga, tu dolor y tu estrés, y le resta el descanso. Si el descanso no alcanza para compensar, este número sube.",
  },
  pain: {
    titulo: "Dolor que se repite",
    queEs:
      "Mira si venís marcando dolor en la misma zona varios días seguidos. Un dolor puntual no cuenta; uno que no se va, sí.",
  },
  event: {
    titulo: "Golpes o episodios puntuales",
    queEs:
      "Si en los últimos 7 días registraste un golpe, un tirón, una caída o algo parecido, suma al riesgo.",
  },
};

/**
 * Guía práctica para el deportista individual: 2–4 acciones concretas en
 * criollo, a partir de los factores que están moviendo su score. Sin la
 * jerga ni el marco de "cuerpo técnico" de recomendaciones().
 */
export function guiaSimple(risk: RiskResult): string[] {
  const tips: string[] = [];

  if (risk.calibracion.activa) {
    tips.push(
      `Seguí cargando el control diario. En ${risk.calibracion.diasFaltantes} ${
        risk.calibracion.diasFaltantes === 1 ? "día" : "días"
      } más el sistema va a poder analizar tu carga de entrenamiento.`,
    );
  }

  if (risk.pain.points === 2) {
    tips.push(
      `Venís con dolor en ${
        risk.pain.persistentZone ?? "una zona"
      } hace varios días. No entrenes esa zona a full y, si no cede en 5–7 días, consultá con un profesional.`,
    );
  } else if (risk.pain.points === 1) {
    tips.push("Tenés una molestia dando vueltas. Prestale atención en cada sesión y no la fuerces.");
  }

  const l = risk.latestLog;
  if (l && l.fatiga >= 7 && l.sueno <= 2) {
    tips.push("Venís muy cansado y durmiendo mal. Meté un día suave o de descanso y cuidá el sueño estos días.");
  } else if (risk.ifs.points === 2) {
    tips.push("La fatiga, el dolor y el estrés juntos le están ganando al descanso. Bajá un cambio esta semana.");
  }

  if (!risk.calibracion.activa && risk.acwr.ratio !== null && risk.acwr.ratio > 1.3) {
    tips.push("Subiste la carga bastante rápido respecto de tu ritmo habitual. Aflojá el volumen unos días.");
  }

  if (risk.event.recent.length > 0) {
    tips.push("Registraste un episodio puntual hace poco. No vuelvas a intensidad plena hasta estar seguro de que está resuelto.");
  }

  if (tips.length === 0) {
    tips.push("No hay señales de alerta. Buen momento para sostener la carga y sumar trabajo de fuerza preventiva.");
  }

  return tips;
}

export function nivelEnCriollo(risk: RiskResult): string {
  switch (risk.semaphore.level) {
    case "bajo":
      return "Vas bien. Seguí con tu plan y cargá los formularios todos los días.";
    case "moderado":
      return "Hay señales para prestar atención: bajá un poco la intensidad esta semana y dormí mejor. Si tenés dudas, consultá con tu preparador o médico.";
    case "alto":
      return "El sistema ve varias señales juntas. Bajá la carga, priorizá el descanso y, si el dolor o el cansancio siguen, consultá con un profesional de la salud.";
  }
}
