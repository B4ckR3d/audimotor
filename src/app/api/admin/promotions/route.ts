import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'promotions', 'read');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const promotions = await prisma.promotion.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(promotions);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data promosi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'promotions', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();

    const result = await prisma.promotion.create({
      data: {
        title: body.title,
        description: body.description || '',
        image_url: body.image_url || '',
        discount_text: body.discount_text || '',
        start_date: body.start_date || null,
        end_date: body.end_date || null,
        is_active: body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
      },
    });

    return NextResponse.json({ message: 'Promosi berhasil ditambahkan', id: result.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menambahkan promosi' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'promotions', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();

    try {
      await prisma.promotion.update({
        where: { id: Number(body.id) },
        data: {
          title: body.title,
          description: body.description || '',
          image_url: body.image_url || '',
          discount_text: body.discount_text || '',
          start_date: body.start_date || null,
          end_date: body.end_date || null,
          is_active: body.is_active ? 1 : 0,
        },
      });
      return NextResponse.json({ message: 'Promosi berhasil diperbarui' });
    } catch {
      return NextResponse.json({ error: 'Promosi tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui promosi' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'promotions', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    try {
      await prisma.promotion.delete({
        where: { id: Number(id) },
      });
      return NextResponse.json({ message: 'Promosi berhasil dihapus' });
    } catch {
      return NextResponse.json({ error: 'Promosi tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus promosi' }, { status: 500 });
  }
}
