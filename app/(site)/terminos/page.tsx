import type { Metadata } from "next";
import Link from "next/link";
import { LegalDoc, Section, P, UL } from "@/components/site/Legal";
import { LEGAL, CONTACTO } from "@/lib/legal";
import { PRECIO_MENSUAL_UYU, precioUYU } from "@/lib/planes";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Condiciones de uso y contratación del servicio CMD Insight.",
};

export default function TerminosPage() {
  return (
    <LegalDoc title="Términos y Condiciones" actualizado="agosto de 2026">
      <Section h="1. Quién presta el servicio">
        <P>
          CMD Insight es operado por {LEGAL.razonSocial} ({LEGAL.formaJuridica}), RUT {LEGAL.rut},
          con domicilio en {LEGAL.pais} (en adelante, &ldquo;CMD Insight&rdquo; o &ldquo;nosotros&rdquo;).
          La plataforma fue desarrollada por {LEGAL.desarrolladaPor}.
        </P>
        <P>
          Para cualquier consulta relativa a estos términos, al servicio o a un cobro, podés
          escribir a {CONTACTO.email} o al WhatsApp {CONTACTO.whatsapp}.
        </P>
      </Section>

      <Section h="2. Qué es el servicio">
        <P>
          CMD Insight es una plataforma web de prevención de lesiones deportivas. El deportista
          registra a diario, en unos dos minutos, cómo se siente (carga percibida del entrenamiento,
          dolor, fatiga, sueño, estrés) y, cuando corresponde, eventos puntuales. Con esos datos la
          plataforma calcula automáticamente un score de riesgo (0 a 7) y muestra su evolución.
        </P>
        <P>
          <strong>El servicio es una herramienta de registro y análisis. No constituye asistencia
          médica, diagnóstico ni tratamiento, y no reemplaza la consulta con un profesional de la
          salud.</strong> Las decisiones sobre entrenamiento, carga o retorno a la actividad son
          responsabilidad del deportista y de su cuerpo técnico o médico.
        </P>
      </Section>

      <Section h="3. Planes, precios y forma de contratación">
        <P>Los precios están expresados en pesos uruguayos e incluyen impuestos.</P>
        <UL>
          <li>
            <strong>Plan Individual — {precioUYU(PRECIO_MENSUAL_UYU.INDIVIDUAL)} por mes.</strong>{" "}
            Para un deportista particular. Se contrata directamente desde la web: el usuario crea su
            cuenta, elige el plan y paga en línea. El pago mensual se procesa a través de dLocal.
          </li>
          <li>
            <strong>Plan Club — {precioUYU(PRECIO_MENSUAL_UYU.CLUB_MENSUAL)} por mes</strong> (plantel
            completo) y <strong>Plan Gimnasio — {precioUYU(PRECIO_MENSUAL_UYU.GIMNASIO)} por mes</strong>{" "}
            (hasta 200 socios). Se contratan a través de nuestro equipo comercial (WhatsApp o correo).
            Definimos con la institución el alcance, la fecha de inicio y la forma de pago, y dejamos
            la cuenta configurada.
          </li>
          <li>
            <strong>Plan Cortesía CMD.</strong> Acceso sin costo que CMD asigna caso por caso a
            instituciones puntuales. No se solicita ni se contrata: se acuerda de forma particular.
          </li>
        </UL>
      </Section>

      <Section h="4. Prueba gratuita">
        <P>
          Todos los planes pagos incluyen una prueba de 30 días sin costo y sin requerir tarjeta.
          Al finalizar la prueba, para continuar hay que activar un plan pago; de lo contrario el
          acceso se suspende. Los datos cargados durante la prueba se conservan por un plazo
          razonable por si se reactiva la cuenta.
        </P>
      </Section>

      <Section h="5. Facturación y renovación">
        <UL>
          <li>El Plan Individual se cobra por mes adelantado y se renueva automáticamente cada mes hasta que el usuario lo cancele.</li>
          <li>Los planes Club y Gimnasio se facturan según lo acordado con la institución (por lo general mensual).</li>
          <li>Un cambio de precio se comunica con al menos 30 días de anticipación y solo aplica al período siguiente.</li>
        </UL>
      </Section>

      <Section h="6. Cancelación y reembolsos">
        <UL>
          <li>
            <strong>Plan Individual:</strong> se puede cancelar en cualquier momento desde la cuenta
            o escribiendo a {CONTACTO.email}. La cancelación detiene las renovaciones futuras; el
            acceso continúa hasta el final del período ya pagado.
          </li>
          <li>
            <strong>Reembolso:</strong> si cancelás dentro de los 7 días de un cobro y no usaste el
            servicio de forma sustancial en ese período, te devolvemos ese cobro. Fuera de ese plazo
            no se reintegran períodos ya iniciados.
          </li>
          <li>
            <strong>Planes Club y Gimnasio:</strong> la cancelación y los eventuales reembolsos se
            rigen por lo pactado con la institución en el momento de la contratación.
          </li>
        </UL>
      </Section>

      <Section h="7. Uso aceptable">
        <P>
          El usuario se compromete a ingresar información veraz, a no compartir sus credenciales y a
          no usar la plataforma para fines ilícitos ni para cargar datos de terceros sin su
          consentimiento. Podemos suspender una cuenta que incumpla estas condiciones.
        </P>
      </Section>

      <Section h="8. Datos personales y de salud">
        <P>
          El tratamiento de los datos (incluidos los de salud autoreportados) se describe en la{" "}
          <Link href="/privacidad" className="font-semibold text-navy underline">
            Política de Privacidad
          </Link>
          . Al usar el servicio, aceptás ese tratamiento.
        </P>
      </Section>

      <Section h="9. Disponibilidad y responsabilidad">
        <P>
          Hacemos un esfuerzo razonable para mantener el servicio disponible, pero puede haber
          interrupciones por mantenimiento o causas de fuerza mayor. En la medida permitida por la
          ley, nuestra responsabilidad se limita al monto abonado por el servicio en los últimos
          tres meses.
        </P>
      </Section>

      <Section h="10. Cambios en estos términos">
        <P>
          Podemos actualizar estos términos. Los cambios relevantes se comunican por correo o dentro
          de la plataforma con al menos 15 días de anticipación.
        </P>
      </Section>

      <Section h="11. Ley aplicable y jurisdicción">
        <P>
          Estos términos se rigen por la ley de la República Oriental del Uruguay. Cualquier
          controversia se somete a los tribunales de Montevideo, sin perjuicio de los derechos que
          la normativa de defensa del consumidor reconozca al usuario.
        </P>
      </Section>
    </LegalDoc>
  );
}
