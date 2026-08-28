import Link from "next/link";

export default function DemoHome() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold text-ink">Demo de la plataforma</h1>
      <p className="mt-3 text-slatey">
        Así se ve CMD Insight por dentro. Elegí desde qué rol querés recorrerla. Todos los datos son
        simulados: hay un plantel ficticio con 35 días de historial y, del lado del deportista,
        podés elegir la disciplina (corredor, fuerza, ciclismo, triatlón, fitness o deporte de
        equipo) para ver cómo cambian los formularios y el score.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Link href="/demo/deportista" className="card p-6 transition-shadow hover:shadow-pop">
          <div className="font-display text-lg font-bold text-ink">Soy deportista</div>
          <p className="mt-2 text-sm text-slatey">
            Elegí tu disciplina, completá los 3 formularios (control diario, semanal y evento
            especial) y mirá cómo cambia tu score de riesgo al instante.
          </p>
          <span className="mt-4 inline-block text-sm font-semibold text-navy">Entrar →</span>
        </Link>

        <Link href="/demo/panel" className="card p-6 transition-shadow hover:shadow-pop">
          <div className="font-display text-lg font-bold text-ink">Soy del cuerpo técnico o médico</div>
          <p className="mt-2 text-sm text-slatey">
            Dashboard del plantel: ranking por riesgo, alertas automáticas, carga semanal e informe
            de lunes. Entrá a la ficha de cualquier jugador.
          </p>
          <span className="mt-4 inline-block text-sm font-semibold text-navy">Ver el panel →</span>
        </Link>
      </div>
    </div>
  );
}
