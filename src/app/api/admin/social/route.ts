import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'social', 'read');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const links = await prisma.socialLink.findMany({
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

export async function POST(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'social', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();

    const result = await prisma.socialLink.create({
      data: {
        platform: body.platform,
        url: body.url,
        icon: body.icon || '',
        is_active: body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
        sort_order: Number(body.sort_order || 0),
      },
    });

    return NextResponse.json({ message: 'Social link berhasil ditambahkan', id: result.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menambahkan social link' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'social', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();

    try {
      await prisma.socialLink.update({
        where: { id: Number(body.id) },
        data: {
          platform: body.platform,
          url: body.url,
          icon: body.icon || '',
          is_active: body.is_active ? 1 : 0,
          sort_order: Number(body.sort_order || 0),
        },
      });
      return NextResponse.json({ message: 'Social link berhasil diperbarui' });
    } catch {
      return NextResponse.json({ error: 'Social link tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui social link' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'social', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    try {
      await prisma.socialLink.delete({
        where: { id: Number(id) },
      });
      return NextResponse.json({ message: 'Social link berhasil dihapus' });
    } catch {
      return NextResponse.json({ error: 'Social link tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus social link' }, { status: 500 });
  }
}
