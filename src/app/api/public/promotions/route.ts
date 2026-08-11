import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Promotion } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const promotions = db.prepare("SELECT * FROM promotions WHERE is_active = 1 ORDER BY id DESC").all() as Promotion[];
    return NextResponse.json(promotions);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data promosi' }, { status: 500 });
  }
}
