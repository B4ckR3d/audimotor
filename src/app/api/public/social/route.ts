import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const links = await prisma.socialLink.findMany({
      where: { is_active: 1 },
      orderBy: [
        { sort_order: 'asc' },
        { id: 'asc' },
      ],
    });
    return NextResponse.json(links);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data social links' }, { status: 500 });
  }
}
