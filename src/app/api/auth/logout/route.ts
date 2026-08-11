import { NextRequest, NextResponse } from 'next/server';
import { deleteSession, getCookieValue } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const token = getCookieValue(cookieHeader, 'session_token');

    if (token) {
      await deleteSession(token);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('session_token', '', { maxAge: 0, path: '/' });

    return response;
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}
