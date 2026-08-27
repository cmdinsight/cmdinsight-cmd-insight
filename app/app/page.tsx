import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { homePathFor } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function AppIndex() {
  const session = await requireSession();
  redirect(homePathFor(session.rol));
}
