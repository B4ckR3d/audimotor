import prisma from './prisma';
import crypto from 'crypto';
import { NextRequest } from 'next/server';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  const [salt, hash] = passwordHash.split(':');
  const hashToVerify = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === hashToVerify;
}

export async function createSession(userId: number): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.session.deleteMany({
    where: { user_id: userId },
  });

  await prisma.session.create({
    data: {
      session_token: token,
      user_id: userId,
      expires_at: expiresAt,
    },
  });

  return token;
}

export async function validateSession(token: string): Promise<{ userId: number; username: string; role: string } | null> {
  const session = await prisma.session.findUnique({
    where: { session_token: token },
    include: { user: true },
  });

  if (!session || !session.user || !session.user.is_active || session.expires_at < new Date()) {
    return null;
  }

  return {
    userId: session.user.id,
    username: session.user.username,
    role: session.user.role || 'admin',
  };
}

export async function deleteSession(token: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { session_token: token },
  });
}

export function getCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function getCurrentUser(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  const token = getCookieValue(cookieHeader, 'session_token');
  if (!token) return null;
  return await validateSession(token);
}

export async function getUserPermissions(roleName: string): Promise<Record<string, string>> {
  const role = await prisma.role.findUnique({
    where: { name: roleName },
  });

  if (!role || !role.permissions) return {};
  try {
    return JSON.parse(role.permissions);
  } catch {
    return {};
  }
}

export async function checkPermission(
  request: NextRequest,
  section: string,
  action: 'read' | 'write'
): Promise<{ allowed: boolean; user: Awaited<ReturnType<typeof getCurrentUser>> }> {
  const user = await getCurrentUser(request);
  if (!user) return { allowed: false, user: null };

  // admin role has full access
  if (user.role === 'admin') return { allowed: true, user };

  const permissions = await getUserPermissions(user.role);
  const perm = permissions[section] || 'none';

  if (action === 'read' && (perm === 'read' || perm === 'write')) {
    return { allowed: true, user };
  }
  if (action === 'write' && perm === 'write') {
    return { allowed: true, user };
  }

  return { allowed: false, user };
}
