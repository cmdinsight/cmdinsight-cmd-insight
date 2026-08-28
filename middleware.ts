import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySession } from "./lib/session";

// El sitio de marketing y la demo simulada (/demo) son públicos.
// Solo se protege el área autenticada (/app) y las APIs de datos.
function isProtected(pathname: string): boolean {
  if (pathname.startsWith("/app")) return true;
  if (pathname.startsWith("/api")) {
    if (pathname.startsWith("/api/auth/login")) return false;
    if (pathname.startsWith("/api/setup")) return false;
    if (pathname.startsWith("/api/registro")) return false;
    if (pathname.startsWith("/api/contacto")) return false;
    return true;
  }
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!isProtected(pathname)) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/acceder";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|cmd-insight-logo.jpeg).*)"],
};
