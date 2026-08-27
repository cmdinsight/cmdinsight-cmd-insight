import { COOKIE_NAME } from "@/lib/session";
import { json, handler } from "@/lib/api";

export const POST = handler(async () => {
  const res = json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
});
