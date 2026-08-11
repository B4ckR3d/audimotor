import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const rows = db
      .prepare("SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('site_name', 'site_logo', 'site_favicon')")
      .all() as { setting_key: string; setting_value: string }[];

    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.setting_key] = row.setting_value;
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
