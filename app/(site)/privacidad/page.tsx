import type { Metadata } from "next";
import Link from "next/link";
import { LegalDoc, Section, P, UL } from "@/components/site/Legal";
import { LEGAL, CONTACTO } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Cómo CMD Insight trata los datos personales y de salud de sus usuarios.",
};

export default function PrivacidadPage() {
  return (
    <LegalDoc title="Política de Privacidad" actualizado="agosto de 2026">
      <Section h="1. Responsable del tratamiento">
        <P>
          El responsable del tratamiento de los datos es {LEGAL.razonSocial} ({LEGAL.formaJuridica}),
          RUT {LEGAL.rut}, {LEGAL.pais}. Consultas sobre tus datos: {CONTACTO.email}.
        </P>
        <P>
          El tratamiento se realiza conforme a la Ley N° 18.331 de Protección de Datos Personales
          del Uruguay y su normativa reglamentaria.
        </P>
      </Section>

      <Section h="2. Qué datos recogemos">
        <UL>
          <li>
            <strong>Datos de cuenta:</strong> nombre, correo electrónico y, según el caso,
            organización a la que pertenecés y rol dentro de ella.
          </li>
          <li>
            <strong>Datos de salud autoreportados:</strong> los que cargás en los formularios —
            carga percibida, minutos de entrenamiento, dolor y su zona, fatiga, calidad del sueño,
            estrés y eventos puntuales (golpes, tirones, etc.).
          </li>
          <li>
            <strong>Datos de ficha médica</strong> (solo cuando una organización los carga):
            antecedentes, lesiones previas, medicación, chequeos y resultados de ECG informados.
          </li>
          <li>
            <strong>Datos técnicos mínimos</strong> necesarios para operar y asegurar la plataforma.
          </li>
        </UL>
      </Section>

      <Section h="3. Para qué los usamos">
        <UL>
          <li>Calcular el score de riesgo y mostrar su evolución.</li>
          <li>
            Poner esa información a disposición de quien corresponde: en un club o gimnasio, del
            cuerpo técnico y del equipo médico de esa institución; en el plan individual, únicamente
            del propio deportista.
          </li>
          <li>Enviar avisos y alertas relacionados con el servicio.</li>
          <li>Gestionar la cuenta, la facturación y el soporte.</li>
        </UL>
        <P>No usamos los datos de salud para publicidad ni para fines ajenos a la prevención de lesiones.</P>
      </Section>

      <Section h="4. Con quién se comparten">
        <UL>
          <li>
            Dentro de la organización del deportista, con los usuarios habilitados (entrenador,
            médico, administrador), según su rol.
          </li>
          <li>
            Con proveedores que nos ayudan a operar (alojamiento de la plataforma y procesamiento de
            pagos —dLocal—), que solo acceden a lo necesario y bajo obligación de confidencialidad.
          </li>
          <li>Cuando lo exija una autoridad competente conforme a derecho.</li>
        </UL>
        <P><strong>No vendemos datos personales.</strong></P>
      </Section>

      <Section h="5. Conservación y seguridad">
        <P>
          Los datos se conservan mientras la cuenta esté activa y por el plazo posterior que exijan
          las obligaciones legales y contables. Se almacenan con cifrado en tránsito y controles de
          acceso por rol.
        </P>
      </Section>

      <Section h="6. Tus derechos">
        <P>
          Podés solicitar el acceso, la rectificación, la actualización o la supresión de tus datos,
          así como oponerte a determinados tratamientos, escribiendo a {CONTACTO.email}. También
          podés presentar un reclamo ante la Unidad Reguladora y de Control de Datos Personales
          (URCDP) del Uruguay.
        </P>
        <P>
          Si tus datos fueron cargados por una organización (tu club o gimnasio), coordinaremos con
          esa organización la atención de tu solicitud.
        </P>
      </Section>

      <Section h="7. Cambios">
        <P>
          Podemos actualizar esta política. Los cambios relevantes se comunican por correo o dentro
          de la plataforma. La fecha de última actualización figura al inicio de este documento.
        </P>
      </Section>

      <Section h="8. Términos relacionados">
        <P>
          Esta política complementa los{" "}
          <Link href="/terminos" className="font-semibold text-navy underline">
            Términos y Condiciones
          </Link>
          .
        </P>
      </Section>
    </LegalDoc>
  );
}
