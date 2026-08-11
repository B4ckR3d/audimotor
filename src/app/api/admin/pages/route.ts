import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'pages', 'read');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const pages = await prisma.page.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(pages);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data halaman' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'pages', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();

    const result = await prisma.page.create({
      data: {
        slug: body.slug,
        title: body.title,
        content: body.content || '',
        meta_description: body.meta_description || '',
        is_active: body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
      },
    });

    return NextResponse.json({ message: 'Halaman berhasil ditambahkan', id: result.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menambahkan halaman' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'pages', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();

    try {
      await prisma.page.update({
        where: { id: Number(body.id) },
        data: {
          slug: body.slug,
          title: body.title,
          content: body.content || '',
          meta_description: body.meta_description || '',
          is_active: body.is_active ? 1 : 0,
        },
      });
      return NextResponse.json({ message: 'Halaman berhasil diperbarui' });
    } catch {
      return NextResponse.json({ error: 'Halaman tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui halaman' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'pages', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    try {
      await prisma.page.delete({
        where: { id: Number(id) },
      });
      return NextResponse.json({ message: 'Halaman berhasil dihapus' });
    } catch {
      return NextResponse.json({ error: 'Halaman tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus halaman' }, { status: 500 });
  }
}
