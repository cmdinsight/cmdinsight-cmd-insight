export const PLAN_LABEL: Record<string, string> = {
  TRIAL: "Trial (30 días)",
  CORTESIA_CMD: "Cortesía CMD",
  CLUB_MENSUAL: "Club — mensual",
  GIMNASIO: "Gimnasio",
  INDIVIDUAL: "Individual",
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
