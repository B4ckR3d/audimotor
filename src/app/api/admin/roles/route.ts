import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'roles', 'read');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const roles = await prisma.role.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(roles);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data roles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'roles', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const { name, label, description, permissions } = body;

    if (!name || !label) {
      return NextResponse.json({ error: 'Name dan label harus diisi' }, { status: 400 });
    }

    const existing = await prisma.role.findUnique({
      where: { name },
    });
    if (existing) {
      return NextResponse.json({ error: 'Role name sudah digunakan' }, { status: 400 });
    }

    const permsJson = typeof permissions === 'string' ? permissions : JSON.stringify(permissions || {});
    const result = await prisma.role.create({
      data: {
        name,
        label,
        description: description || '',
        permissions: permsJson,
      },
    });

    return NextResponse.json({ message: 'Role berhasil ditambahkan', id: result.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menambahkan role' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'roles', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, label, description, permissions, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    const permsJson = typeof permissions === 'string' ? permissions : JSON.stringify(permissions || {});
    try {
      await prisma.role.update({
        where: { id: Number(id) },
        data: {
          name,
          label,
          description: description || '',
          permissions: permsJson,
          is_active: is_active ? 1 : 0,
        },
      });
      return NextResponse.json({ message: 'Role berhasil diperbarui' });
    } catch {
      return NextResponse.json({ error: 'Role tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui role' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'roles', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    const roleId = Number(id);
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (role && (role.name === 'admin' || role.name === 'editor')) {
      return NextResponse.json({ error: 'Tidak bisa menghapus role default' }, { status: 400 });
    }

    try {
      await prisma.role.delete({
        where: { id: roleId },
      });
      return NextResponse.json({ message: 'Role berhasil dihapus' });
    } catch {
      return NextResponse.json({ error: 'Role tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus role' }, { status: 500 });
  }
}
