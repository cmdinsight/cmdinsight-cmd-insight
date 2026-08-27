import type { Config } from "tailwindcss";

/**
 * Sistema de color CMD Insight (ver spec §3):
 *  - Base clínica: blancos y grises neutros.
 *  - Primario de marca: azul/teal (confianza médica + tecnología).
 *  - Semáforo verde/amarillo/rojo: RESERVADO exclusivamente para nivel de riesgo.
 *    No usar los colores de riesgo de forma decorativa en ningún otro contexto.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primario de marca
        navy: {
          DEFAULT: "#173a63",
          deep: "#0f2947",
          soft: "#2b5788",
        },
        teal: {
          DEFAULT: "#0e9aa1",
          deep: "#0b7a80",
          soft: "#5cc2c6",
        },
        // Base clínica / neutros
        ink: "#0f1b2d",
        slatey: "#5b6b7f",
        line: "#e4eaf1",
        mist: "#f4f7fa",
        // Semáforo de riesgo (SOLO riesgo)
        risk: {
          low: "#16a34a",
          "low-bg": "#e8f6ec",
          mod: "#e08a00",
          "mod-bg": "#fbf0dc",
          high: "#dc2626",
          "high-bg": "#fbe6e6",
        },
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,27,45,0.04), 0 8px 24px -12px rgba(15,27,45,0.12)",
        pop: "0 12px 40px -12px rgba(15,27,45,0.22)",
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};

export default config;
