"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PerfilSelect } from "@/components/app/PerfilSelect";
import { DEFAULT_PERFIL } from "@/lib/score/perfiles";

export default function RegistroForm() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [perfil, setPerfil] = useState<string>(DEFAULT_PERFIL);
  const [acepta, setAcepta] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acepta) {
      setError("Tenés que aceptar los Términos y la Política de Privacidad.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password, perfil, acepta, website }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se pudo crear la cuenta.");
        setLoading(false);
        return;
      }
      router.push("/app/mi");
      router.refresh();
    } catch {
      setError("Error de conexión.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label" htmlFor="nombre">Nombre y apellido</label>
        <input id="nombre" className="input" autoComplete="name" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="label" htmlFor="password">Contraseña</label>
        <input id="password" type="password" autoComplete="new-password" className="input" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
        <p className="mt-1 text-xs text-slatey">Mínimo 8 caracteres.</p>
      </div>
      <div>
        <label className="label">¿Qué tipo de deportista sos?</label>
        <PerfilSelect value={perfil} onChange={setPerfil} />
        <p className="mt-1 text-xs text-slatey">Podés cambiarlo después desde tu perfil.</p>
      </div>

      {/* honeypot: oculto para personas, tentador para bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      <label className="flex items-start gap-2 text-sm text-slatey">
        <input type="checkbox" className="mt-0.5" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} />
        <span>
          Acepto los{" "}
          <Link href="/terminos" target="_blank" className="font-semibold text-navy underline">Términos</Link>{" "}
          y la{" "}
          <Link href="/privacidad" target="_blank" className="font-semibold text-navy underline">Política de Privacidad</Link>.
          Entiendo que es una herramienta de autocontrol y no reemplaza la consulta con un profesional de la salud.
        </span>
      </label>

      {error && <p className="text-sm font-medium text-[#b91c1c]">{error}</p>}

      <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-60">
        {loading ? "Creando tu cuenta…" : "Crear mi cuenta y empezar"}
      </button>
      <p className="text-center text-xs text-slatey">
        Prueba de 30 días. No pedimos tarjeta para empezar.
      </p>
    </form>
  );
}
