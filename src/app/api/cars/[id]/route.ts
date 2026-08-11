import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const car = await prisma.car.findUnique({
      where: { id: Number(id) },
    });

    if (!car) {
      return NextResponse.json({ error: 'Mobil tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data mobil' }, { status: 500 });
  }
}
