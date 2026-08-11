import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      orderBy: [
        { is_featured: 'desc' },
        { created_at: 'desc' },
      ],
    });
    return NextResponse.json(cars);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data mobil' }, { status: 500 });
  }
}
