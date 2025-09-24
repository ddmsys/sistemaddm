import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Páginas protegidas
  const protectedPaths = ["/clients", "/crm", "/projects", "/finance"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Verificar se está tentando acessar página protegida
  if (isProtectedPath) {
    // Verificar se tem token de auth (você pode implementar lógica mais robusta)
    const authToken = request.cookies.get("auth-token");

    if (!authToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login).*)"],
};
