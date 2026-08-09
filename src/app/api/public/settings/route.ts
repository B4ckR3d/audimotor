import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const rows = db
      .prepare("SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('brand_name', 'brand_logo_url')")
      .all() as { setting_key: string; setting_value: string }[];

    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.setting_key] = row.setting_value;
    }

    return NextResponse.json({
      brand_name: settings.brand_name || 'Audi Motor',
      brand_logo_url: settings.brand_logo_url || '',
    });
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil pengaturan' }, { status: 500 });
  }
}
