import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { AppShell } from "@/components/app/AppShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Plataforma",
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  return <AppShell session={session}>{children}</AppShell>;
}
