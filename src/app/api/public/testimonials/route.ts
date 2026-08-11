import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { is_active: 1 },
      orderBy: [
        { sort_order: 'asc' },
        { id: 'desc' },
      ],
    });
    return NextResponse.json(testimonials);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data testimonial' }, { status: 500 });
  }
}
