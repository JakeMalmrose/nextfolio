import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthUser {
  id: string;
  username: string;
  role: string;
}

export function createToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch (error) {
    return null;
  }
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return null;
  }

  // Verify user still exists in database
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, username: true, role: true },
  });

  return user;
}

export function requireAuth(request: NextRequest, user: AuthUser | null): { error: string } | null {
  if (!user) {
    return { error: 'Authentication required' };
  }
  return null;
}

export function requireAdmin(request: NextRequest, user: AuthUser | null): { error: string } | null {
  const authError = requireAuth(request, user);
  if (authError) {
    return authError;
  }

  if (user!.role !== 'admin') {
    return { error: 'Admin access required' };
  }

  return null;
}
