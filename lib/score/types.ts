// Tipos del motor de riesgo de lesión de CMD Insight.
// Toda la lógica de cálculo vive en engine.ts, perfiles.ts y trend.ts.

// Conjunto completo de zonas de dolor (la unión de todos los perfiles).
// Cada perfil expone su propio subconjunto en perfiles.ts.
export type PainZone =
  | "Ninguna"
  | "Isquiotibiales"
  | "Cuádriceps"
  | "Gemelos"
  | "Aductores"
  | "Rodilla"
  | "Tobillo"
  | "Cadera"
  | "Espalda"
  | "Lumbar"
  | "Cervical"
  | "Hombro"
  | "Codo"
  | "Muñeca / mano"
  | "Tibia"
  | "Tendón de Aquiles"
  | "Fascia plantar"
  | "Cintilla iliotibial"
  | "Otra";

export const PAIN_ZONES: PainZone[] = [
  "Ninguna",
  "Isquiotibiales",
  "Cuádriceps",
  "Gemelos",
  "Aductores",
  "Rodilla",
  "Tobillo",
  "Cadera",
  "Espalda",
  "Lumbar",
  "Cervical",
  "Hombro",
  "Codo",
  "Muñeca / mano",
  "Tibia",
  "Tendón de Aquiles",
  "Fascia plantar",
  "Cintilla iliotibial",
  "Otra",
];

export type PerfilDeportista =
  | "EQUIPO"
  | "CORREDOR"
  | "CICLISTA"
  | "TRIATLETA"
  | "FUERZA"
  | "FITNESS";

/** Solo aplica al perfil FUERZA: distinguir dolor muscular (DOMS, tolerado) de articular. */
export type TipoDolor = "muscular" | "articular";

// Formulario 1 — Control diario (después de cada entrenamiento o sesión)
export interface DailyLog {
  /** Fecha ISO yyyy-mm-dd */
  date: string;
  /** Carga percibida del entrenamiento / sesión (RPE) 0–10 */
  rpe: number;
  /** Duración en minutos */
  minutes: number;
  /** Dolor muscular / articular actual 0–10 */
  dolor: number;
  /** Zona principal de molestia */
  zona: PainZone;
  /** Fatiga general 0–10 */
  fatiga: number;
  /** Calidad del sueño 1–5 (1 muy malo · 5 excelente) */
  sueno: number;
  /** Estrés / cansancio mental 0–10 */
  estres: number;

  // ---- Campos por perfil (opcionales) ----
  /** CORREDOR / CICLISTA: distancia del día en km */
  km?: number;
  /** FUERZA: tipo de dolor reportado */
  tipoDolor?: TipoDolor;
  /** FUERZA: si la sesión incluyó trabajo al fallo muscular */
  entrenoAlFallo?: boolean;
}

// Formulario 2 — Control semanal
export interface WeeklyLog {
  /** Fecha ISO del inicio de semana */
  weekStart: string;
  /** Dolor en la misma zona durante más de 5 días esta semana */
  dolorPersistente: boolean;
  /** Alguna molestia afectó el rendimiento esta semana */
  dolorLimitoRendimiento: boolean;
  /** Sensación de piernas pesadas 0–10 */
  piernasPesadas: number;
  /** Horas promedio de sueño por noche */
  horasSueno: number;
  /** Jugó o entrenó con dolor esta semana */
  entrenoConDolor: boolean;
}

// Conjunto completo de tipos de evento (la unión de todos los perfiles).
export type SpecialEventType =
  | "Golpe fuerte"
  | "Tirón muscular"
  | "Sobrecarga progresiva"
  | "Calambres repetidos"
  | "Molestia de lesión previa"
  | "Dolor agudo al correr"
  | "Pisada en falso"
  | "Cambio de calzado"
  | "Caída"
  | "Pinchazo agudo levantando"
  | "Molestia articular bajo carga"
  | "Otro";

export const SPECIAL_EVENT_TYPES: SpecialEventType[] = [
  "Golpe fuerte",
  "Tirón muscular",
  "Sobrecarga progresiva",
  "Calambres repetidos",
  "Molestia de lesión previa",
  "Dolor agudo al correr",
  "Pisada en falso",
  "Cambio de calzado",
  "Caída",
  "Pinchazo agudo levantando",
  "Molestia articular bajo carga",
  "Otro",
];

// Formulario 3 — Evento o molestia especial
export interface SpecialEvent {
  date: string;
  tipos: SpecialEventType[];
  comentario?: string;
}

export type RiskLevel = "bajo" | "moderado" | "alto";
export type RiskColor = "low" | "mod" | "high";
