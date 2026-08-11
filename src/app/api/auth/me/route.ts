import { NextRequest, NextResponse } from 'next/server';
import { validateSession, getCookieValue, getUserPermissions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const token = getCookieValue(cookieHeader, 'session_token');

    if (!token) {
      return NextResponse.json({ error: 'Tidak ada sesi aktif' }, { status: 401 });
    }

    const session = await validateSession(token);
    if (!session) {
      const response = NextResponse.json({ error: 'Sesi sudah berakhir' }, { status: 401 });
      response.cookies.set('session_token', '', { maxAge: 0, path: '/' });
      return response;
    }

    const permissions = await getUserPermissions(session.role);

    return NextResponse.json({
      success: true,
      user: {
        id: session.userId,
        username: session.username,
        role: session.role,
        permissions
      }
    });
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}
