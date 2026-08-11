import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, verifyPassword, validateSession, getCookieValue } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const token = getCookieValue(cookieHeader, 'session_token');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await validateSession(token);
    if (!session) {
      return NextResponse.json({ error: 'Sesi berakhir' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        username: true,
        full_name: true,
        role: true,
        created_at: true,
      },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil profil' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const token = getCookieValue(cookieHeader, 'session_token');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await validateSession(token);
    if (!session) {
      return NextResponse.json({ error: 'Sesi berakhir' }, { status: 401 });
    }

    const body = await request.json();
    const { full_name, current_password, new_password } = body;

    if (new_password) {
      if (!current_password) {
        return NextResponse.json({ error: 'Password lama harus diisi' }, { status: 400 });
      }

      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { password_hash: true },
      });

      if (!user || !verifyPassword(current_password, user.password_hash)) {
        return NextResponse.json({ error: 'Password lama salah' }, { status: 400 });
      }

      const passwordHash = hashPassword(new_password);
      await prisma.user.update({
        where: { id: session.userId },
        data: {
          full_name: full_name || '',
          password_hash: passwordHash,
        },
      });
    } else {
      await prisma.user.update({
        where: { id: session.userId },
        data: {
          full_name: full_name || '',
        },
      });
    }

    return NextResponse.json({ message: 'Profil berhasil diperbarui' });
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui profil' }, { status: 500 });
  }
}
