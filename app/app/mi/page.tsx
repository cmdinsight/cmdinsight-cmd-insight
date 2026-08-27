import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getMiDeportista } from "@/lib/data/deportistas";
import { RiskBadge } from "@/components/risk/RiskBadge";

export const dynamic = "force-dynamic";

const FORMS = [
  { href: "/app/mi/control-diario", t: "Control diario", d: "Después de cada entrenamiento o partido. 2 minutos." },
  { href: "/app/mi/control-semanal", t: "Control semanal", d: "Una vez por semana." },
  { href: "/app/mi/evento", t: "Evento o molestia especial", d: "Solo cuando pasa algo puntual." },
];

export default async function MiPage() {
  const session = await requireRole("DEPORTISTA");
  const d = await getMiDeportista(session.sub);

  if (!d) {
    return (
      <div className="mx-auto max-w-lg">
        <h1 className="font-display text-2xl font-extrabold text-ink">Hola, {session.nombre}</h1>
        <div className="card mt-4 p-6 text-sm text-slatey">
          Tu usuario todavía no está vinculado a un perfil de deportista. Pedile a quien administra
          tu club, gimnasio o cuenta que te vincule.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Hola, {d.nombre}</h1>
          <p className="mt-1 text-sm text-slatey">
            Completá tus formularios con sinceridad. Nos ayuda a cuidar tu salud y prevenir lesiones.
          </p>
        </div>
        <RiskBadge score={d.risk.score} trend={d.risk.trend} />
      </div>

      <Link
        href="/app/mi/evolucion"
        className="mt-6 flex items-center justify-between rounded-2xl border border-line bg-white p-5 hover:shadow-card"
      >
        <div>
          <div className="text-sm text-slatey">Tu score de riesgo hoy</div>
          <div className="font-display text-3xl font-extrabold text-ink">
            {d.risk.score}
            <span className="text-lg text-slatey">/7</span> · {d.risk.semaphore.label}
          </div>
          <div className="mt-1 text-sm text-slatey">{d.risk.semaphore.accion}</div>
        </div>
        <span className="text-navy">Ver detalle →</span>
      </Link>

      <div className="mt-6 grid gap-4">
        {FORMS.map((f) => (
          <Link key={f.href} href={f.href} className="card flex items-center justify-between p-5 hover:shadow-pop">
            <div>
              <div className="font-display text-base font-bold text-ink">{f.t}</div>
              <p className="mt-1 text-sm text-slatey">{f.d}</p>
            </div>
            <span className="ml-4 text-navy">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
