import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'contact', 'read');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const contacts = await prisma.contactInfo.findMany({
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

export async function POST(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'contact', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();

    const result = await prisma.contactInfo.create({
      data: {
        contact_type: body.contact_type,
        contact_value: body.contact_value,
        label: body.label || '',
        is_active: body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
        sort_order: Number(body.sort_order || 0),
      },
    });

    return NextResponse.json({ message: 'Kontak berhasil ditambahkan', id: result.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menambahkan kontak' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'contact', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();

    try {
      await prisma.contactInfo.update({
        where: { id: Number(body.id) },
        data: {
          contact_type: body.contact_type,
          contact_value: body.contact_value,
          label: body.label || '',
          is_active: body.is_active ? 1 : 0,
          sort_order: Number(body.sort_order || 0),
        },
      });
      return NextResponse.json({ message: 'Kontak berhasil diperbarui' });
    } catch {
      return NextResponse.json({ error: 'Kontak tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui kontak' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'contact', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    try {
      await prisma.contactInfo.delete({
        where: { id: Number(id) },
      });
      return NextResponse.json({ message: 'Kontak berhasil dihapus' });
    } catch {
      return NextResponse.json({ error: 'Kontak tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus kontak' }, { status: 500 });
  }
}
