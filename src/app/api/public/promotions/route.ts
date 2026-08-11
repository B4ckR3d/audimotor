import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const promotions = await prisma.promotion.findMany({
      where: { is_active: 1 },
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(promotions);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data promosi' }, { status: 500 });
  }
}
