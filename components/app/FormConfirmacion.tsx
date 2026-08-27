"use client";

import Link from "next/link";

export function FormConfirmacion({ titulo }: { titulo: string }) {
  return (
    <div className="mx-auto max-w-md text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal/10">
        <svg className="h-7 w-7 text-teal-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 13l4 4 10-11" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="mt-4 font-display text-xl font-extrabold text-ink">{titulo}</h1>
      <p className="mt-2 text-sm text-slatey">
        Gracias por completarlo. El cuerpo técnico y el equipo médico ya tienen tus datos y te van a
        avisar si hay algo para ajustar.
      </p>
      <Link href="/app/mi" className="btn btn-primary mt-6">
        Volver
      </Link>
    </div>
  );
}
