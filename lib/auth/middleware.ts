/**
 * JWT Verification Middleware for API Routes
 * Provides secure token verification for API endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromHeader } from '@/lib/auth/token';
import { createErrorResponse, ErrorCodes } from '@/lib/utils/api-response';
import type { SessionPayload } from '@/types';

export interface AuthenticatedRequest extends NextRequest {
  user?: SessionPayload;
}

/**
 * Extract and verify JWT token from request
 */
export async function verifyAuth(
  request: NextRequest,
  options?: { requireAdmin?: boolean }
): Promise<{ valid: boolean; user?: SessionPayload; error?: string }> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    let token = getTokenFromHeader(authHeader);

    // Fallback: try x-auth-token header (for some clients)
    if (!token) {
      token = request.headers.get('x-auth-token') || null;
    }

    if (!token) {
      return {
        valid: false,
        error: 'Missing authentication token',
      };
    }

    // Verify token signature and expiration
    const user = await verifyToken(token);

    if (!user) {
      return {
        valid: false,
        error: 'Invalid or expired token',
      };
    }

    // Check admin requirement
    if (options?.requireAdmin && !user.isAdmin) {
      return {
        valid: false,
        error: 'Admin access required',
      };
    }

    return {
      valid: true,
      user,
    };
  } catch (error: any) {
    console.error('Auth verification error:', error);
    return {
      valid: false,
      error: 'Authentication failed',
    };
  }
}

/**
 * Middleware wrapper for protected API routes
 * Usage:
 *   export async function GET(req: NextRequest) {
 *     const auth = await withAuth(req);
 *     if (!auth.valid) return auth.response;
 *     // your handler code here
 *   }
 */
export async function withAuth(
  request: NextRequest,
  options?: { requireAdmin?: boolean }
): Promise<{
  valid: boolean;
  user?: SessionPayload;
  response?: NextResponse;
}> {
  const result = await verifyAuth(request, options);

  if (!result.valid) {
    const statusCode = result.error?.includes('admin') ? 403 : 401;
    return {
      valid: false,
      response: NextResponse.json(
        createErrorResponse(
          statusCode === 403 ? ErrorCodes.FORBIDDEN : ErrorCodes.UNAUTHORIZED,
          result.error || 'Unauthorized'
        ),
        { status: statusCode }
      ),
    };
  }

  return {
    valid: true,
    user: result.user,
  };
}

/**
 * Extract user ID from request (after authentication)
 */
export function extractUserId(request: NextRequest): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    // Token verification should happen before calling this
    // This is a fallback to x-user-id header set by middleware
  }

  // Fallback to x-user-id header (set by middleware)
  return request.headers.get('x-user-id');
}
