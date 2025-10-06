// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get('auth-token');

  // Rotas que não precisam de autenticação
  const publicRoutes = ['/login', '/register', '/', '/portal'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Se é rota pública, permitir acesso
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Se é rota protegida e não tem token, redirecionar para login
  if (pathname.startsWith('/(authenticated)') && !authCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se é área administrativa, verificar permissões
  if (pathname.startsWith('/admin') && !authCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/(authenticated)/:path*',
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
