import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="eyebrow">404</div>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-ink">Página no encontrada</h1>
      <p className="mt-2 text-slatey">La dirección que buscabas no existe o se movió.</p>
      <Link href="/" className="btn btn-primary mt-6">
        Volver al inicio
      </Link>
    </div>
  );
}
