import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const contacts = await prisma.contactInfo.findMany({
      where: { is_active: 1 },
      orderBy: [
        { sort_order: 'asc' },
        { id: 'asc' },
      ],
    });
    return NextResponse.json(contacts);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data kontak' }, { status: 500 });
  }
}
