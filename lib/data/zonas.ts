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
  Otra: "OTRA",
};

export function zonaToLabel(z: string): PainZone {
  return ZONA_TO_LABEL[z] ?? "Otra";
}

export function labelToZona(l: PainZone): string {
  return LABEL_TO_ZONA[l] ?? "OTRA";
}
