"use client";

import { useRouter } from "next/navigation";

export function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      className={className || "text-sm font-semibold text-slatey hover:text-navy"}
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/acceder");
        router.refresh();
      }}
    >
      Salir
    </button>
  );
}
