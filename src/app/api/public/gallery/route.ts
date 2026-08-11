import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { GalleryItem } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const items = db.prepare('SELECT * FROM gallery WHERE is_active = 1 ORDER BY sort_order ASC, id DESC').all() as GalleryItem[];
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data gallery' }, { status: 500 });
  }
}
