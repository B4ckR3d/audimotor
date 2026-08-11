import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: {
        setting_key: {
          in: ['site_name', 'site_logo', 'site_favicon'],
        },
      },
    });

    const settings: Record<string, string> = {};
    for (const row of rows) {
      if (row.setting_value) {
        settings[row.setting_key] = row.setting_value;
      }
    }

    return NextResponse.json({
      brand_name: settings.site_name || 'Audi Motor',
      brand_logo_url: settings.site_logo || '',
      favicon_url: settings.site_favicon || '',
    });
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil pengaturan' }, { status: 500 });
  }
}
