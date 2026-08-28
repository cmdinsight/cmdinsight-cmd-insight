"use client";

import { useState } from "react";
import Link from "next/link";
import type { TrialInfo } from "@/lib/trial";

export function AvisosBar({
  trial,
  emailVerificado,
}: {
  trial: TrialInfo;
  emailVerificado: boolean;
}) {
  const avisos: React.ReactNode[] = [];

  if (!emailVerificado) avisos.push(<VerificarEmailAviso key="email" />);

  if (trial.estado === "por_vencer") {
    avisos.push(
      <Aviso key="trial" tono="warn">
        Te {trial.diasRestantes === 1 ? "queda 1 día" : `quedan ${trial.diasRestantes} días`} de
        prueba.{" "}
        <Link href="/contacto" className="underline">
          Escribinos
        </Link>{" "}
        para continuar sin cortes.
      </Aviso>,
    );
  } else if (trial.estado === "vencido") {
    avisos.push(
      <Aviso key="trial" tono="stop">
        Tu período de prueba venció.{" "}
        <Link href="/contacto" className="underline">
          Escribinos
        </Link>{" "}
        para reactivar la cuenta.
      </Aviso>,
    );
  }

  if (avisos.length === 0) return null;
  return <div className="border-b border-line">{avisos}</div>;
}

function Aviso({
  tono,
  children,
}: {
  tono: "info" | "warn" | "stop";
  children: React.ReactNode;
}) {
  const cls =
    tono === "stop"
      ? "bg-risk-high-bg text-[#b91c1c]"
      : tono === "warn"
        ? "bg-risk-mod-bg text-[#b45309]"
        : "bg-navy/[0.05] text-navy";
  return <div className={`px-4 py-2 text-center text-sm font-medium ${cls}`}>{children}</div>;
}

function VerificarEmailAviso() {
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");

  const reenviar = async () => {
    setEstado("enviando");
    try {
      const res = await fetch("/api/verificacion/reenviar", { method: "POST" });
      setEstado(res.ok ? "ok" : "error");
    } catch {
      setEstado("error");
    }
  };

  return (
    <Aviso tono="info">
      Verificá tu email para asegurar el acceso a tu cuenta.{" "}
      {estado === "ok" ? (
        <span className="font-semibold">Te reenviamos el correo.</span>
      ) : estado === "error" ? (
        <span className="font-semibold">No se pudo enviar. Probá más tarde.</span>
      ) : (
        <button onClick={reenviar} disabled={estado === "enviando"} className="underline disabled:opacity-60">
          {estado === "enviando" ? "Enviando…" : "Reenviar verificación"}
        </button>
      )}
    </Aviso>
  );
}
