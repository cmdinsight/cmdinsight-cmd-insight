import type { PainZone } from "@/lib/score/types";

// Enum ZonaDolor (Prisma) <-> etiqueta PainZone (motor de score / UI).

export const ZONA_TO_LABEL: Record<string, PainZone> = {
  NINGUNA: "Ninguna",
  ISQUIOTIBIALES: "Isquiotibiales",
  CUADRICEPS: "Cuádriceps",
  GEMELOS: "Gemelos",
  ADUCTORES: "Aductores",
  RODILLA: "Rodilla",
  TOBILLO: "Tobillo",
  CADERA: "Cadera",
  ESPALDA: "Espalda",
  LUMBAR: "Lumbar",
  CERVICAL: "Cervical",
  HOMBRO: "Hombro",
  CODO: "Codo",
  MUNECA: "Muñeca / mano",
  TIBIA: "Tibia",
  AQUILES: "Tendón de Aquiles",
  FASCIA_PLANTAR: "Fascia plantar",
  CINTILLA: "Cintilla iliotibial",
  OTRA: "Otra",
};

export const LABEL_TO_ZONA: Record<PainZone, string> = {
  Ninguna: "NINGUNA",
  Isquiotibiales: "ISQUIOTIBIALES",
  "Cuádriceps": "CUADRICEPS",
  Gemelos: "GEMELOS",
  Aductores: "ADUCTORES",
  Rodilla: "RODILLA",
  Tobillo: "TOBILLO",
  Cadera: "CADERA",
  Espalda: "ESPALDA",
  Lumbar: "LUMBAR",
  Cervical: "CERVICAL",
  Hombro: "HOMBRO",
  Codo: "CODO",
  "Muñeca / mano": "MUNECA",
  Tibia: "TIBIA",
  "Tendón de Aquiles": "AQUILES",
  "Fascia plantar": "FASCIA_PLANTAR",
  "Cintilla iliotibial": "CINTILLA",
  Otra: "OTRA",
};

export function zonaToLabel(z: string): PainZone {
  return ZONA_TO_LABEL[z] ?? "Otra";
}

export function labelToZona(l: PainZone): string {
  return LABEL_TO_ZONA[l] ?? "OTRA";
}
