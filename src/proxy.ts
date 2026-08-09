import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('session_token')?.value;

  // Proxy only checks cookie PRESENCE (can't access DB in Node.js runtime).
  // Full DB session validation happens in API routes via checkPermission/getCurrentUser.
  if (pathname.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Note: /login redirect is intentionally removed.
  // When a session expires, /api/auth/me clears the cookie automatically.
  // This prevents infinite redirect loop: /admin → /login → /admin → ...

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login']
};
