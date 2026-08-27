// Roles como unión de strings (sin importar el enum de Prisma, para que sirva
// también en el middleware / edge runtime). Los valores coinciden 1:1 con el
// enum `Rol` de schema.prisma.

export type Rol = "DEPORTISTA" | "ENTRENADOR" | "MEDICO" | "ADMIN_ORG" | "ADMIN_CMD";

export const ROLES: Rol[] = ["DEPORTISTA", "ENTRENADOR", "MEDICO", "ADMIN_ORG", "ADMIN_CMD"];

export const ROL_LABEL: Record<Rol, string> = {
  DEPORTISTA: "Deportista",
  ENTRENADOR: "Entrenador / cuerpo técnico",
  MEDICO: "Médico",
  ADMIN_ORG: "Administrador de la organización",
  ADMIN_CMD: "Administrador CMD",
};

/** Rol que ve el dashboard del plantel (cuerpo técnico / médico). */
export const STAFF_ROLES: Rol[] = ["ENTRENADOR", "MEDICO", "ADMIN_ORG"];

/** Rol que puede editar datos clínicos completos. */
export const CLINICAL_ROLES: Rol[] = ["MEDICO", "ADMIN_CMD"];

/** Rol que gestiona altas de deportistas / usuarios dentro de una organización. */
export const ORG_ADMIN_ROLES: Rol[] = ["ADMIN_ORG", "ADMIN_CMD"];

export function homePathFor(rol: Rol): string {
  switch (rol) {
    case "DEPORTISTA":
      return "/app/mi";
    case "ENTRENADOR":
    case "MEDICO":
      return "/app/plantel";
    case "ADMIN_ORG":
      return "/app/organizacion";
    case "ADMIN_CMD":
      return "/app/cmd";
  }
}
