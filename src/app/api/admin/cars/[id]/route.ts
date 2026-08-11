import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkPermission } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { allowed } = await checkPermission(request, 'cars', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const carId = Number(id);

    try {
      await prisma.car.update({
        where: { id: carId },
        data: {
          name: body.name,
          brand: body.brand,
          model: body.model,
          year: Number(body.year),
          price: Number(body.price),
          mileage: Number(body.mileage),
          transmission: body.transmission || 'Automatic',
          fuel: body.fuel || 'Bensin',
          color: body.color || 'Hitam',
          description: body.description || '',
          image_url: body.image_url || '',
          status: body.status || 'available',
          is_featured: body.is_featured ? 1 : 0,
        },
      });
      return NextResponse.json({ message: 'Mobil berhasil diperbarui' });
    } catch {
      return NextResponse.json({ error: 'Mobil tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui mobil' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { allowed } = await checkPermission(request, 'cars', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { id } = await params;
    const carId = Number(id);

    try {
      await prisma.car.delete({
        where: { id: carId },
      });
      return NextResponse.json({ message: 'Mobil berhasil dihapus' });
    } catch {
      return NextResponse.json({ error: 'Mobil tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus mobil' }, { status: 500 });
  }
}
