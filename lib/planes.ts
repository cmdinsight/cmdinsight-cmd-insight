export const PLAN_LABEL: Record<string, string> = {
  TRIAL: "Prueba 30 días",
  CORTESIA_CMD: "Cortesía CMD",
  CLUB_MENSUAL: "Plan Club",
  GIMNASIO: "Plan Gimnasio",
  INDIVIDUAL: "Plan Individual",
};

export const ORG_TIPO_LABEL: Record<string, string> = {
  CLUB: "Club deportivo",
  GIMNASIO: "Gimnasio",
  INDIVIDUAL: "Deportista individual",
};

// Precios de lista, en pesos uruguayos por mes. Fuente única para la web.
// El cobro (dLocal, sobre todo para los planes individuales) queda en el backlog.
export const PRECIO_MENSUAL_UYU: Record<string, number> = {
  CLUB_MENSUAL: 4500,
  GIMNASIO: 8500,
  INDIVIDUAL: 160,
};

export function precioUYU(n: number): string {
  return "$" + n.toLocaleString("es-UY");
}

// Descripción corta de cada plan, para mostrar al elegir el plan de una organización.
export const PLAN_DESC: Record<string, string> = {
  TRIAL:
    "Acceso completo sin costo por 30 días. Al vencer se pasa a un plan pago (o se da de baja).",
  CORTESIA_CMD:
    "Acceso sin costo que CMD asigna caso por caso a instituciones puntuales. No es automático ni tiene vencimiento fijo.",
  CLUB_MENSUAL:
    "El club paga la plataforma: $4.500/mes, plantel completo. Va incluido gratis si el club tiene cobertura médica CMD durante los entrenamientos.",
  GIMNASIO:
    "El gimnasio paga la plataforma: $8.500/mes, hasta 200 socios.",
  INDIVIDUAL:
    "Un deportista particular: $160/mes, pago por la web (dLocal). Sin asistencia médica: es una herramienta de autocontrol.",
};

// Planes que tiene sentido asignar según el tipo de organización.
export const PLANES_POR_TIPO: Record<string, string[]> = {
  CLUB: ["TRIAL", "CLUB_MENSUAL", "CORTESIA_CMD"],
  GIMNASIO: ["TRIAL", "GIMNASIO", "CORTESIA_CMD"],
  INDIVIDUAL: ["TRIAL", "INDIVIDUAL"],
};

export const TODOS_LOS_PLANES = ["TRIAL", "CLUB_MENSUAL", "GIMNASIO", "INDIVIDUAL", "CORTESIA_CMD"];

export function planesParaTipo(tipo?: string | null): string[] {
  return (tipo && PLANES_POR_TIPO[tipo]) || TODOS_LOS_PLANES;
}
