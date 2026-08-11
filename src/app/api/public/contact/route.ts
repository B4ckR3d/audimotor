import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ContactInfo } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const contacts = db.prepare("SELECT * FROM contact_info WHERE is_active = 1 ORDER BY sort_order ASC, id ASC").all() as ContactInfo[];
    return NextResponse.json(contacts);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data kontak' }, { status: 500 });
  }
}
