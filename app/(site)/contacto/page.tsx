import type { Metadata } from "next";
import ContactForm from "@/components/site/ContactForm";
import { CONTACTO } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escribinos por el formulario, WhatsApp o correo electrónico.",
};

export default function ContactoPage() {
  return (
    <section className="section">
      <div className="wrap grid gap-12 md:grid-cols-[1fr_1.1fr]">
        <div>
          <div className="eyebrow">Contacto</div>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-ink">Hablemos</h1>
          <p className="mt-4 text-slatey">
            ¿Dudas sobre los planes, una demo para tu club o gimnasio, o algo de tu cuenta?
            Escribinos y te respondemos.
          </p>

          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-ink">Correo electrónico</dt>
              <dd>
                <a href={`mailto:${CONTACTO.email}`} className="text-navy hover:underline">
                  {CONTACTO.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">WhatsApp</dt>
              <dd>
                <a href={CONTACTO.whatsappLink} className="text-navy hover:underline">
                  {CONTACTO.whatsapp}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Horario</dt>
              <dd className="text-slatey">{CONTACTO.horario}</dd>
            </div>
          </dl>
        </div>

        <div>
          <ContactForm origen="pagina-contacto" />
        </div>
      </div>
    </section>
  );
}
