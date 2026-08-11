import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'gallery', 'read');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const items = await prisma.gallery.findMany({
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

export async function POST(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'gallery', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();

    const result = await prisma.gallery.create({
      data: {
        title: body.title,
        description: body.description || '',
        image_url: body.image_url,
        category: body.category || 'general',
        sort_order: Number(body.sort_order || 0),
        is_active: body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
      },
    });

    return NextResponse.json({ message: 'Gambar berhasil ditambahkan', id: result.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menambahkan gambar' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'gallery', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();

    try {
      await prisma.gallery.update({
        where: { id: Number(body.id) },
        data: {
          title: body.title,
          description: body.description || '',
          image_url: body.image_url,
          category: body.category || 'general',
          sort_order: Number(body.sort_order || 0),
          is_active: body.is_active ? 1 : 0,
        },
      });
      return NextResponse.json({ message: 'Gambar berhasil diperbarui' });
    } catch {
      return NextResponse.json({ error: 'Gambar tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui gambar' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'gallery', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    try {
      await prisma.gallery.delete({
        where: { id: Number(id) },
      });
      return NextResponse.json({ message: 'Gambar berhasil dihapus' });
    } catch {
      return NextResponse.json({ error: 'Gambar tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus gambar' }, { status: 500 });
  }
}
