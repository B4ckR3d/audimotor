import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Testimonial } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const testimonials = db
      .prepare('SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC, id DESC')
      .all() as Testimonial[];
    return NextResponse.json(testimonials);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data testimonial' }, { status: 500 });
  }
}
