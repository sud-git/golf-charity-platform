import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * Middleware Authentication Module
 * Handles JWT verification, token validation, and role-based access control
 */

// Routes that require authentication
export const PROTECTED_ROUTES = ['/dashboard'];
export const ADMIN_ROUTES = ['/admin'];

// Routes that should redirect to dashboard if already logged in
export const AUTH_ROUTES = ['/login', '/signup', '/reset-password'];

// Public routes (no auth required)
export const PUBLIC_ROUTES = [
  '/api/charities',
  '/api/auth/login',
  '/api/auth/signup',
];

/**
 * Get JWT secret from environment
 * Throws error if not configured
 */
export const getSecret = (): Uint8Array => {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is not configured');
  }
  return new TextEncoder().encode(secret);
};

/**
 * Verify JWT token and extract payload
 * Returns user data if valid, null if invalid or expired
 */
export async function verifyJWT(
  token: string
): Promise<{ userId: string; isAdmin: boolean; email: string } | null> {
  try {
    const secret = getSecret();
    const verified = await jwtVerify(token, secret);

    return {
      userId: (verified.payload.userId as string) || '',
      email: (verified.payload.email as string) || '',
      isAdmin: (verified.payload.isAdmin as boolean) || false,
    };
  } catch (error) {
    // Token is invalid, expired, or verification failed
    return null;
  }
}

/**
 * Extract token from Authorization header or cookies
 * Checks Authorization header (Bearer token) first, then cookies
 */
export function getToken(request: NextRequest): string | null {
  // Try Authorization header first (Bearer token)
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // Fallback to cookie (for browser requests)
  return request.cookies.get('auth_token')?.value || null;
}

/**
 * Check if route is protected
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if route is admin-only
 */
export function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if route is public
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if route is auth route (login, signup, etc.)
 */
export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Create unauthorized response
 */
export function createUnauthorizedResponse(
  redirectUrl: string = '/login'
): NextResponse {
  const url = new URL(redirectUrl, process.env.NEXTAUTH_URL || 'http://localhost:3000');
  return NextResponse.redirect(url);
}

/**
 * Create forbidden response
 */
export function createForbiddenResponse(message: string = 'Access Denied'): NextResponse {
  return NextResponse.json({ error: message }, { status: 403 });
}

/**
 * Create response with user context headers
 */
export function createResponseWithUserContext(
  userId: string,
  isAdmin: boolean,
  email: string
): NextResponse {
  const response = NextResponse.next();
  response.headers.set('x-user-id', userId);
  response.headers.set('x-is-admin', isAdmin ? 'true' : 'false');
  response.headers.set('x-user-email', email);
  return response;
}

/**
 * Validate request authentication and authorization
 * Used by API routes for manual validation
 */
export async function validateAuth(
  request: NextRequest,
  requireAdmin: boolean = false
): Promise<{
  isValid: boolean;
  userId?: string;
  email?: string;
  isAdmin?: boolean;
  error?: string;
}> {
  try {
    const token = getToken(request);

    if (!token) {
      return {
        isValid: false,
        error: 'No authentication token provided',
      };
    }

    const payload = await verifyJWT(token);

    if (!payload) {
      return {
        isValid: false,
        error: 'Invalid or expired token',
      };
    }

    if (requireAdmin && !payload.isAdmin) {
      return {
        isValid: false,
        error: 'Admin access required',
      };
    }

    return {
      isValid: true,
      userId: payload.userId,
      email: payload.email,
      isAdmin: payload.isAdmin,
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Authentication validation failed',
    };
  }
}
