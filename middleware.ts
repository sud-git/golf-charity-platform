// middleware.ts - Protect dashboard and admin routes
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard'];
const ADMIN_ROUTES = ['/admin'];

// Routes that should redirect to dashboard if already logged in
const AUTH_ROUTES = ['/login', '/signup', '/reset-password'];

// Public routes (no auth required)
const PUBLIC_ROUTES = ['/api/charities', '/api/auth/login', '/api/auth/signup'];

// Get JWT secret
const getSecret = (): Uint8Array => {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is not configured');
  }
  return new TextEncoder().encode(secret);
};

/**
 * Verify JWT token and extract payload
 */
async function verifyJWT(token: string): Promise<{ userId: string; isAdmin: boolean } | null> {
  try {
    const secret = getSecret();
    const verified = await jwtVerify(token, secret);
    return {
      userId: verified.payload.userId as string,
      isAdmin: (verified.payload.isAdmin as boolean) || false,
    };
  } catch {
    return null;
  }
}

/**
 * Extract token from Authorization header or cookies
 */
function getToken(request: NextRequest): string | null {
  // Try Authorization header first (Bearer token)
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // Fallback to cookie (for browser requests)
  return request.cookies.get('auth_token')?.value || null;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip checking public API routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get token from request
  const token = getToken(request);

  // Verify token if present
  let tokenPayload: { userId: string; isAdmin: boolean } | null = null;
  if (token) {
    tokenPayload = await verifyJWT(token);
  }

  // ========== ADMIN ROUTES ==========
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!tokenPayload) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Check admin role
    if (!tokenPayload.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Add user context to request headers
    const response = NextResponse.next();
    response.headers.set('x-user-id', tokenPayload.userId);
    response.headers.set('x-is-admin', 'true');
    return response;
  }

  // ========== PROTECTED DASHBOARD ROUTES ==========
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!tokenPayload) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Add user context to request headers
    const response = NextResponse.next();
    response.headers.set('x-user-id', tokenPayload.userId);
    response.headers.set('x-is-admin', tokenPayload.isAdmin ? 'true' : 'false');
    return response;
  }

  // ========== AUTH ROUTES ==========
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    // Already logged in - redirect to dashboard
    if (tokenPayload) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Dashboard pages (protected)
    '/dashboard/:path*',
    // Admin pages (admin only)
    '/admin/:path*',
    // Auth pages (redirects if logged in)
    '/login',
    '/signup',
    '/reset-password',
  ],
};
