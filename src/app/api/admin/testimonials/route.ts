import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'testimonials', 'read');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const testimonials = await prisma.testimonial.findMany({
      orderBy: [
        { sort_order: 'asc' },
        { id: 'desc' },
      ],
    });
    return NextResponse.json(testimonials);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data testimonial' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'testimonials', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();

    const result = await prisma.testimonial.create({
      data: {
        customer_name: body.customer_name,
        customer_avatar: body.customer_avatar || '',
        rating: Number(body.rating || 5),
        comment: body.comment,
        car_purchased: body.car_purchased || '',
        is_active: body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
        sort_order: Number(body.sort_order || 0),
      },
    });

    return NextResponse.json({ message: 'Testimonial berhasil ditambahkan', id: result.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menambahkan testimonial' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'testimonials', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();

    try {
      await prisma.testimonial.update({
        where: { id: Number(body.id) },
        data: {
          customer_name: body.customer_name,
          customer_avatar: body.customer_avatar || '',
          rating: Number(body.rating || 5),
          comment: body.comment,
          car_purchased: body.car_purchased || '',
          is_active: body.is_active ? 1 : 0,
          sort_order: Number(body.sort_order || 0),
        },
      });
      return NextResponse.json({ message: 'Testimonial berhasil diperbarui' });
    } catch {
      return NextResponse.json({ error: 'Testimonial tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui testimonial' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { allowed } = await checkPermission(request, 'testimonials', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    try {
      await prisma.testimonial.delete({
        where: { id: Number(id) },
      });
      return NextResponse.json({ message: 'Testimonial berhasil dihapus' });
    } catch {
      return NextResponse.json({ error: 'Testimonial tidak ditemukan' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus testimonial' }, { status: 500 });
  }
}
