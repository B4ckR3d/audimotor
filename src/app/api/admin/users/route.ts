import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, checkPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'users', 'read');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        full_name: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'users', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const { username, password, full_name, role } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password harus diisi' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { username },
    });
    if (existing) {
      return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 400 });
    }

    const passwordHash = hashPassword(password);
    const result = await prisma.user.create({
      data: {
        username,
        password_hash: passwordHash,
        full_name: full_name || '',
        role: role || 'editor',
        is_active: 1,
      },
    });

    return NextResponse.json({ message: 'User berhasil ditambahkan', id: result.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menambahkan user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed, user } = await checkPermission(request, 'users', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const { id, username, password, full_name, role, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    if (user?.role !== 'admin' && role) {
      return NextResponse.json({ error: 'Hanya admin yang bisa mengubah role' }, { status: 403 });
    }

    const userId = Number(id);
    const dataToUpdate: Record<string, unknown> = {
      username,
      full_name,
      role,
      is_active: is_active ? 1 : 0,
    };

    if (password) {
      dataToUpdate.password_hash = hashPassword(password);
    }

    try {
      await prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
      });
      return NextResponse.json({ message: 'User berhasil diperbarui' });
    } catch {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { allowed, user } = await checkPermission(request, 'users', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    const userId = Number(id);

    if (userId === user?.userId) {
      return NextResponse.json({ error: 'Tidak bisa menghapus akun sendiri' }, { status: 400 });
    }

    try {
      await prisma.user.delete({
        where: { id: userId },
      });
      return NextResponse.json({ message: 'User berhasil dihapus' });
    } catch {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus user' }, { status: 500 });
  }
}
