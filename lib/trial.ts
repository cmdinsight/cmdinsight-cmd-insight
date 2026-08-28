// Estado del período de prueba de una organización.
// El cobro real (dLocal) está en el backlog; por ahora esto solo informa y,
// para el plan individual vencido, muestra una pantalla de "prueba terminada".

export type EstadoTrial = "sin_limite" | "activo" | "por_vencer" | "vencido";

export interface TrialInfo {
  estado: EstadoTrial;
  /** Días enteros hasta el vencimiento (0 si ya venció, null si no aplica). */
  diasRestantes: number | null;
  venceEl: Date | null;
}

/** A cuántos días del vencimiento se empieza a avisar. */
export const DIAS_AVISO_TRIAL = 5;

export function trialInfo(
  org: { plan?: string | null; trialHasta?: Date | string | null } | null | undefined,
): TrialInfo {
  if (!org || org.plan !== "TRIAL" || !org.trialHasta) {
    return { estado: "sin_limite", diasRestantes: null, venceEl: null };
  }
  const venceEl = new Date(org.trialHasta);
  const dias = Math.ceil((venceEl.getTime() - Date.now()) / 86_400_000);

  if (dias <= 0) return { estado: "vencido", diasRestantes: 0, venceEl };
  if (dias <= DIAS_AVISO_TRIAL) return { estado: "por_vencer", diasRestantes: dias, venceEl };
  return { estado: "activo", diasRestantes: dias, venceEl };
}

export function fmtFecha(d: Date): string {
  return d.toLocaleDateString("es-UY", { day: "numeric", month: "long", year: "numeric" });
}
