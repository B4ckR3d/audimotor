import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await prisma.gallery.findMany({
      where: { is_active: 1 },
      orderBy: [
        { sort_order: 'asc' },
        { id: 'desc' },
      ],
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data gallery' }, { status: 500 });
  }
}
