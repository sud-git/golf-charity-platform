// middleware.ts - Protect dashboard routes
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/admin',
];

// Routes that should redirect to dashboard if already logged in
const AUTH_ROUTES = [
  '/login',
  '/signup',
  '/reset-password',
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if user has auth token
  const token = request.cookies.get('auth_token')?.value;
  const authToken = request.headers.get('authorization')?.split(' ')[1];
  const hasAuth = token || authToken;

  // Redirect to login if accessing protected route without auth
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!hasAuth) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Redirect to dashboard if accessing auth routes while logged in
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (hasAuth) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected routes
    '/dashboard/:path*',
    '/admin/:path*',
    // Auth routes
    '/login',
    '/signup',
    '/reset-password',
  ],
};
