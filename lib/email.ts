// Envío de email, agnóstico del proveedor.
//
// Hoy usa la API REST de Resend (sin dependencia npm: solo fetch). Si no está
// configurado `RESEND_API_KEY`, no envía nada y deja constancia en los logs
// del servidor (útil mientras no hay dominio de envío verificado).
//
// Variables de entorno (en Vercel, nunca en el repo):
//   RESEND_API_KEY   clave de la API de Resend
//   EMAIL_FROM       remitente, ej. "CMD Insight <no-reply@cmdtech.uy>"

const FROM = process.env.EMAIL_FROM || "CMD Insight <onboarding@resend.dev>";

export interface EmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/** Devuelve true si el email se entregó al proveedor. */
export async function enviarEmail({ to, subject, html, text }: EmailInput): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[email] sin RESEND_API_KEY — no se envía · to=${to} · subject="${subject}"`);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to, subject, html, text: text ?? stripHtml(html) }),
    });
    if (!res.ok) {
      console.error(`[email] Resend respondió ${res.status}:`, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (e) {
    console.error("[email] fallo de red al llamar a Resend:", e);
    return false;
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
