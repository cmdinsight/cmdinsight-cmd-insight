"use client";

import { useState } from "react";

export default function ContactForm({ origen = "web" }: { origen?: string }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, mensaje, website, origen }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "No se pudo enviar el mensaje.");
        setState("error");
        return;
      }
      setState("ok");
    } catch {
      setError("Error de conexión.");
      setState("error");
    }
  };

  if (state === "ok") {
    return (
      <div className="card p-6">
        <div className="font-display text-lg font-bold text-ink">¡Mensaje enviado!</div>
        <p className="mt-2 text-sm text-slatey">
          Gracias por escribirnos. Te vamos a responder al correo que dejaste.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      <div>
        <label className="label" htmlFor="c-nombre">Nombre</label>
        <input
          id="c-nombre"
          className="input"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          maxLength={120}
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="c-email">Correo electrónico</label>
        <input
          id="c-email"
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={160}
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="c-mensaje">Mensaje</label>
        <textarea
          id="c-mensaje"
          className="input"
          rows={5}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          maxLength={4000}
          required
        />
      </div>

      {/* Honeypot: oculto para personas, visible para bots */}
      <div aria-hidden style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          No completar este campo
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      {error && <p className="text-sm font-medium text-[#b91c1c]">{error}</p>}

      <button
        type="submit"
        disabled={state === "sending"}
        className="btn btn-primary disabled:opacity-60"
      >
        {state === "sending" ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
