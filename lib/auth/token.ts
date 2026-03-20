// Authentication Utilities

import { jwtVerify, SignJWT } from 'jose';
import { SessionPayload } from '@/types';
import bcryptjs from 'bcryptjs';

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'secret-change-me-in-production'
);

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 10);
}

// Verify password
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

// Create JWT Token
export async function createToken(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(secret);

  return token;
}

// Create Refresh Token
export async function createRefreshToken(
  payload: Omit<SessionPayload, 'iat' | 'exp'>
): Promise<string> {
  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  return token;
}

// Verify Token
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

// Get token from Authorization header
export function getTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

// Get token from cookies
export function getTokenFromCookie(cookies: string): string | null {
  const match = cookies.match(/auth_token=([^;]*)/);
  return match?.[1] || null;
}
