import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password harus diisi' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        username: username,
        is_active: 1,
      },
    });

    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
    }

    const sessionToken = await createSession(user.id);

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, full_name: user.full_name, role: user.role }
    });

    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
