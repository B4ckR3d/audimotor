import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'features', 'read');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const features = await prisma.feature.findMany({
      orderBy: [
        { sort_order: 'asc' },
        { id: 'asc' },
      ],
    });
    return NextResponse.json(features);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data fitur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'features', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();

    const result = await prisma.feature.create({
      data: {
        icon: body.icon,
        title: body.title,
        description: body.description,
        sort_order: Number(body.sort_order || 0),
        is_active: body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
      },
    });

    return NextResponse.json({ message: 'Fitur berhasil ditambahkan', id: result.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menambahkan fitur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'features', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();

    try {
      await prisma.feature.update({
        where: { id: Number(body.id) },
        data: {
          icon: body.icon,
          title: body.title,
          description: body.description,
          sort_order: Number(body.sort_order || 0),
          is_active: body.is_active ? 1 : 0,
        },
      });
      return NextResponse.json({ message: 'Fitur berhasil diperbarui' });
    } catch {
      return NextResponse.json({ error: 'Fitur tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui fitur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'features', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    try {
      await prisma.feature.delete({
        where: { id: Number(id) },
      });
      return NextResponse.json({ message: 'Fitur berhasil dihapus' });
    } catch {
      return NextResponse.json({ error: 'Fitur tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus fitur' }, { status: 500 });
  }
}
