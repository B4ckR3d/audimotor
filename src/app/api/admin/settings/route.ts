import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'settings', 'read');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const settings = await prisma.siteSetting.findMany({
      orderBy: [
        { setting_group: 'asc' },
        { setting_key: 'asc' },
      ],
    });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil pengaturan' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'settings', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();

    const upsertItem = async (item: { key: string; value: string; type?: string; group?: string }) => {
      await prisma.siteSetting.upsert({
        where: { setting_key: item.key },
        update: {
          setting_value: item.value,
          setting_type: item.type || 'text',
          setting_group: item.group || 'general',
        },
        create: {
          setting_key: item.key,
          setting_value: item.value,
          setting_type: item.type || 'text',
          setting_group: item.group || 'general',
        },
      });
    };

    if (Array.isArray(body.settings)) {
      for (const item of body.settings) {
        await upsertItem(item);
      }
    } else {
      await upsertItem(body);
    }

    return NextResponse.json({ message: 'Pengaturan berhasil disimpan' });
  } catch {
    return NextResponse.json({ error: 'Gagal menyimpan pengaturan' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'settings', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();

    const updateItem = async (item: { key: string; value: string }) => {
      await prisma.siteSetting.update({
        where: { setting_key: item.key },
        data: { setting_value: item.value },
      });
    };

    if (Array.isArray(body.settings)) {
      for (const item of body.settings) {
        await updateItem(item);
      }
    } else {
      await updateItem(body);
    }

    return NextResponse.json({ message: 'Pengaturan berhasil diperbarui' });
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui pengaturan' }, { status: 500 });
  }
}
