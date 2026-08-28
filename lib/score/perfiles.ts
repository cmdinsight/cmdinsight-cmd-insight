// Configuración por perfil de deportista.
// El perfil personaliza: qué pregunta el formulario, las zonas de dolor y tipos de evento,
// y los umbrales del motor de riesgo. Ver docs/perfiles-de-deportista.md.

import type { PainZone, PerfilDeportista, SpecialEventType } from "./types";

export const DEFAULT_PERFIL: PerfilDeportista = "EQUIPO";

export interface PerfilConfig {
  key: PerfilDeportista;
  label: string;
  descripcion: string;
  /** Texto de la primera pregunta del control diario. */
  preguntaCarga: string;
  /** Preguntas extra del control diario para este perfil. */
  campos: {
    km?: boolean;
    entrenoAlFallo?: boolean;
    tipoDolor?: boolean;
  };
  zonas: PainZone[];
  eventos: SpecialEventType[];
  acwr: {
    /** ratio a partir del cual el sub-score suma 1 punto */
    p1: number;
    /** ratio a partir del cual el sub-score suma 2 puntos */
    p2: number;
    /** rango considerado "zona óptima" */
    optimo: [number, number];
    /** rango seguro para el análisis de tendencia a 30 días */
    seguro: [number, number];
  };
  dolor: {
    /** días con dolor ≥5 en la misma zona (dentro de 10 días) para 2 puntos */
    diasPersistente: number;
    /** FUERZA: solo el dolor articular/tendinoso cuenta para la persistencia (el muscular es DOMS) */
    distingueTipo: boolean;
  };
}

const BASE_ZONAS_MMII: PainZone[] = [
  "Ninguna",
  "Isquiotibiales",
  "Cuádriceps",
  "Gemelos",
  "Aductores",
  "Rodilla",
  "Tobillo",
  "Cadera",
  "Espalda",
  "Otra",
];

export const PERFILES: Record<PerfilDeportista, PerfilConfig> = {
  EQUIPO: {
    key: "EQUIPO",
    label: "Deporte de equipo",
    descripcion: "Fútbol, básquet, hándbol y deportes de pelota. Carga percibida × minutos.",
    preguntaCarga: "¿Qué tan exigente sentiste el entrenamiento o partido de hoy?",
    campos: {},
    zonas: BASE_ZONAS_MMII,
    eventos: [
      "Golpe fuerte",
      "Tirón muscular",
      "Sobrecarga progresiva",
      "Calambres repetidos",
      "Molestia de lesión previa",
      "Otro",
    ],
    acwr: { p1: 1.2, p2: 1.3, optimo: [0.8, 1.3], seguro: [0.8, 1.5] },
    dolor: { diasPersistente: 5, distingueTipo: false },
  },

  CORREDOR: {
    key: "CORREDOR",
    label: "Corredor / fondo",
    descripcion: "Running de calle, pista o trail. Las lesiones son casi todas por sobrecarga.",
    preguntaCarga: "¿Qué tan exigente sentiste la corrida de hoy?",
    campos: { km: true },
    zonas: [
      "Ninguna",
      "Rodilla",
      "Tibia",
      "Tendón de Aquiles",
      "Fascia plantar",
      "Cintilla iliotibial",
      "Isquiotibiales",
      "Gemelos",
      "Tobillo",
      "Cadera",
      "Otra",
    ],
    eventos: [
      "Dolor agudo al correr",
      "Tirón muscular",
      "Sobrecarga progresiva",
      "Pisada en falso",
      "Cambio de calzado",
      "Molestia de lesión previa",
      "Otro",
    ],
    acwr: { p1: 1.3, p2: 1.5, optimo: [0.8, 1.5], seguro: [0.7, 1.6] },
    dolor: { diasPersistente: 3, distingueTipo: false },
  },

  CICLISTA: {
    key: "CICLISTA",
    label: "Ciclismo",
    descripcion: "Ruta o MTB. Carga por horas; molestias de contacto además de rodilla.",
    preguntaCarga: "¿Qué tan exigente sentiste la salida de hoy?",
    campos: { km: true },
    zonas: [
      "Ninguna",
      "Rodilla",
      "Cintilla iliotibial",
      "Lumbar",
      "Cervical",
      "Muñeca / mano",
      "Cuádriceps",
      "Cadera",
      "Otra",
    ],
    eventos: [
      "Caída",
      "Molestia articular bajo carga",
      "Sobrecarga progresiva",
      "Molestia de lesión previa",
      "Otro",
    ],
    acwr: { p1: 1.3, p2: 1.5, optimo: [0.8, 1.5], seguro: [0.7, 1.6] },
    dolor: { diasPersistente: 4, distingueTipo: false },
  },

  TRIATLETA: {
    key: "TRIATLETA",
    label: "Triatlón / multideporte",
    descripcion: "Combina nado, bici y corrida. Carga total alta; vigilar la transición de disciplinas.",
    preguntaCarga: "¿Qué tan exigente sentiste la sesión de hoy?",
    campos: { km: true },
    zonas: [
      "Ninguna",
      "Rodilla",
      "Tibia",
      "Tendón de Aquiles",
      "Fascia plantar",
      "Cintilla iliotibial",
      "Hombro",
      "Lumbar",
      "Gemelos",
      "Cadera",
      "Otra",
    ],
    eventos: [
      "Dolor agudo al correr",
      "Tirón muscular",
      "Caída",
      "Sobrecarga progresiva",
      "Molestia de lesión previa",
      "Otro",
    ],
    acwr: { p1: 1.3, p2: 1.5, optimo: [0.8, 1.5], seguro: [0.7, 1.6] },
    dolor: { diasPersistente: 3, distingueTipo: false },
  },

  FUERZA: {
    key: "FUERZA",
    label: "Fuerza / gimnasio",
    descripcion:
      "Musculación, powerlifting, crossfit. El dolor muscular post-entreno (DOMS) es normal; la señal es el dolor articular.",
    preguntaCarga: "¿Qué tan exigente sentiste la sesión de hoy?",
    campos: { entrenoAlFallo: true, tipoDolor: true },
    zonas: [
      "Ninguna",
      "Hombro",
      "Lumbar",
      "Rodilla",
      "Codo",
      "Muñeca / mano",
      "Cadera",
      "Cervical",
      "Isquiotibiales",
      "Otra",
    ],
    eventos: [
      "Pinchazo agudo levantando",
      "Molestia articular bajo carga",
      "Tirón muscular",
      "Sobrecarga progresiva",
      "Molestia de lesión previa",
      "Otro",
    ],
    acwr: { p1: 1.4, p2: 1.6, optimo: [0.7, 1.5], seguro: [0.6, 1.7] },
    dolor: { diasPersistente: 4, distingueTipo: true },
  },

  FITNESS: {
    key: "FITNESS",
    label: "Fitness / recreativo",
    descripcion: "Entrenamiento general para estar en forma. Versión simple; foco en no sobrepasarse.",
    preguntaCarga: "¿Qué tan exigente sentiste la sesión de hoy?",
    campos: {},
    zonas: ["Ninguna", "Rodilla", "Lumbar", "Hombro", "Cervical", "Cadera", "Otra"],
    eventos: [
      "Tirón muscular",
      "Sobrecarga progresiva",
      "Molestia articular bajo carga",
      "Molestia de lesión previa",
      "Otro",
    ],
    acwr: { p1: 1.4, p2: 1.6, optimo: [0.7, 1.5], seguro: [0.6, 1.7] },
    dolor: { diasPersistente: 5, distingueTipo: false },
  },
};

export function getPerfil(key?: string | null): PerfilConfig {
  return PERFILES[(key as PerfilDeportista) ?? DEFAULT_PERFIL] ?? PERFILES[DEFAULT_PERFIL];
}

export const PERFIL_KEYS = Object.keys(PERFILES) as PerfilDeportista[];

export const PERFIL_OPCIONES = PERFIL_KEYS.map((k) => ({
  value: k,
  label: PERFILES[k].label,
  descripcion: PERFILES[k].descripcion,
}));
