import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkPermission } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const hero = await prisma.heroSection.findFirst({
      where: { is_active: 1 },
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(hero || null);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data hero' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'hero', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();

    await prisma.heroSection.updateMany({
      data: { is_active: 0 },
    });

    const result = await prisma.heroSection.create({
      data: {
        title: body.title,
        subtitle: body.subtitle,
        badge: body.badge,
        button_primary_text: body.button_primary_text,
        button_primary_link: body.button_primary_link,
        button_secondary_text: body.button_secondary_text,
        button_secondary_link: body.button_secondary_link,
        background_image: body.background_image,
        background_video: body.background_video,
        is_active: 1,
      },
    });

    return NextResponse.json({ message: 'Hero berhasil disimpan', id: result.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menyimpan hero' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'hero', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();

    try {
      await prisma.heroSection.update({
        where: { id: Number(body.id) },
        data: {
          title: body.title,
          subtitle: body.subtitle,
          badge: body.badge,
          button_primary_text: body.button_primary_text,
          button_primary_link: body.button_primary_link,
          button_secondary_text: body.button_secondary_text,
          button_secondary_link: body.button_secondary_link,
          background_image: body.background_image,
          background_video: body.background_video,
        },
      });
      return NextResponse.json({ message: 'Hero berhasil diperbarui' });
    } catch {
      return NextResponse.json({ error: 'Hero tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui hero' }, { status: 500 });
  }
}
