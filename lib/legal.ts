// Datos legales y de contacto del sitio. Requerido por dLocal Go para validar el merchant.
// Deben coincidir EXACTO con lo cargado en dLocal Go (Configuración → Datos de la empresa).

export const LEGAL = {
  // Sociedad de hecho registrada en dLocal Go (RUT 220266830010).
  // TODO verificar si el nombre completo lleva un sufijo (ej. "- Sociedad de Hecho").
  razonSocial: "González Guerrero Manuel Alejandro y Arredondo Diez Camila",
  formaJuridica: "sociedad de hecho",
  rut: "220266830010",
  pais: "Uruguay",
  // Quién desarrolla el producto (atribución, no es el operador legal).
  desarrolladaPor: "CMD Tech — unidad tecnológica de Integra Medical Group",
  // URL registrada en dLocal Go. Hay que actualizarla a la definitiva antes de pedir la validación.
  sitioRegistrado: "https://cmdinsight.lovable.app/",
};

export const CONTACTO = {
  email: "administracion@coberturamedicad.com",
  // WhatsApp comercial que se muestra en el sitio.
  whatsapp: "+598 96 276 998",
  whatsappLink: "https://wa.me/59896276998",
  // Teléfono registrado en dLocal Go (por si conviene unificar).
  telefonoDlocal: "+598 98 052210",
  horario: "Respondemos de lunes a viernes.",
};

export function lineaLegal(): string {
  return `Operado por ${LEGAL.razonSocial} (${LEGAL.formaJuridica}) · RUT ${LEGAL.rut} · ${LEGAL.pais}`;
}
