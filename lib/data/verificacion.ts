import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { enviarEmail, escapeHtml } from "@/lib/email";

export function nuevoToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Genera (o regenera) el token de verificación del usuario y le manda el mail.
 * `baseUrl` es el origin del sitio (ej. https://cmd-insight.vercel.app).
 * Devuelve la URL de verificación (para logs / reintentos manuales).
 */
export async function enviarVerificacionEmail(
  usuario: { id: string; email: string; nombre: string },
  baseUrl: string,
): Promise<string> {
  const token = nuevoToken();
  await prisma.usuario.update({ where: { id: usuario.id }, data: { verifToken: token } });

  const url = `${baseUrl.replace(/\/$/, "")}/verificar-email?token=${token}`;
  const nombre = escapeHtml(usuario.nombre);

  await enviarEmail({
    to: usuario.email,
    subject: "Confirmá tu email · CMD Insight",
    html: `
      <div style="font-family:system-ui,Arial,sans-serif;font-size:15px;color:#1f2937;line-height:1.5">
        <p>Hola ${nombre},</p>
        <p>Confirmá tu dirección de email para terminar de activar tu cuenta en CMD Insight:</p>
        <p><a href="${url}" style="display:inline-block;background:#0f2c4e;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Confirmar mi email</a></p>
        <p style="font-size:13px;color:#6b7280">O pegá este enlace en el navegador:<br>${url}</p>
        <p style="font-size:13px;color:#6b7280">Si no creaste esta cuenta, ignorá este mensaje.</p>
      </div>`,
    text: `Hola ${usuario.nombre}, confirmá tu email en CMD Insight: ${url}`,
  });

  return url;
}

/** Marca el email como verificado a partir del token. Devuelve true si funcionó. */
export async function confirmarEmail(token: string): Promise<boolean> {
  if (!token) return false;
  const u = await prisma.usuario.findUnique({ where: { verifToken: token }, select: { id: true } });
  if (!u) return false;
  await prisma.usuario.update({
    where: { id: u.id },
    data: { emailVerificadoEn: new Date(), verifToken: null },
  });
  return true;
}
