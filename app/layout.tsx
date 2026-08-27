import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CMD Insight · Prevención de lesiones deportivas",
    template: "%s · CMD Insight",
  },
  description:
    "La plataforma digital de prevención de lesiones de CMD — Cobertura Médica Deportiva. No solo cubrimos lesiones: las anticipamos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white antialiased">{children}</body>
    </html>
  );
}
