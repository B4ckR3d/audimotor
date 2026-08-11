import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { SocialLink } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const links = db.prepare('SELECT * FROM social_links WHERE is_active = 1 ORDER BY sort_order ASC, id ASC').all() as SocialLink[];
    return NextResponse.json(links);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data social links' }, { status: 500 });
  }
}
