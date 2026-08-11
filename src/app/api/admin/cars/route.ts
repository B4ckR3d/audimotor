import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkPermission } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'cars', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();

    const result = await prisma.car.create({
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

    return NextResponse.json({ message: 'Mobil berhasil ditambahkan', id: result.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menambahkan mobil' }, { status: 500 });
  }
}
