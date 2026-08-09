'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

interface Setting {
  id: number;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  setting_group: string;
}

const defaultSettings = [
  { key: 'site_name', value: 'Audi Motor', type: 'text', group: 'general', label: 'Nama Website' },
  { key: 'site_tagline', value: 'Dealer Mobil Keluarga Terpercaya', type: 'text', group: 'general', label: 'Tagline' },
  { key: 'site_description', value: 'Spesialis mobil keluarga bekas berkualitas premium.', type: 'textarea', group: 'general', label: 'Deskripsi Website' },
  { key: 'site_logo', value: '', type: 'image', group: 'general', label: 'Logo Website' },
  { key: 'site_favicon', value: '', type: 'image', group: 'general', label: 'Favicon' },
  { key: 'whatsapp_number', value: '6281234567890', type: 'text', group: 'contact', label: 'Nomor WhatsApp' },
  { key: 'phone_number', value: '021-555-0123', type: 'text', group: 'contact', label: 'Nomor Telepon' },
  { key: 'email', value: 'info@audimotor.com', type: 'text', group: 'contact', label: 'Email' },
  { key: 'address', value: 'Jl. Jendral Sudirman No. 123, Jakarta Selatan, 12345', type: 'textarea', group: 'contact', label: 'Alamat' },
  { key: 'facebook_url', value: '#', type: 'text', group: 'social', label: 'Facebook URL' },
  { key: 'instagram_url', value: '#', type: 'text', group: 'social', label: 'Instagram URL' },
  { key: 'youtube_url', value: '#', type: 'text', group: 'social', label: 'YouTube URL' },
  { key: 'tiktok_url', value: '#', type: 'text', group: 'social', label: 'TikTok URL' },
  { key: 'meta_title', value: 'Audi Motor - Dealer Mobil Keluarga Terpercaya', type: 'text', group: 'seo', label: 'Meta Title' },
  { key: 'meta_description', value: 'Dealer mobil bekas berkualitas premium untuk keluarga Anda.', type: 'textarea', group: 'seo', label: 'Meta Description' },
];

export default function CmsSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        setSettings(data);
        const formMap: Record<string, string> = {};
        data.forEach((s: Setting) => { formMap[s.setting_key] = s.setting_value; });
        setForm(formMap);
      } catch {
        console.error('Gagal mengambil pengaturan');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const settingsPayload = Object.entries(form).map(([key, value]) => {
        const existing = settings.find(s => s.setting_key === key);
        return {
          key,
          value,
          type: existing?.setting_type || 'text',
          group: existing?.setting_group || 'general',
        };
      });

      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsPayload }),
      });
      alert('Pengaturan berhasil disimpan!');
    } catch {
      alert('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (key: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setForm(prev => ({ ...prev, [key]: data.url }));
      }
    } catch {
      alert('Gagal upload file');
    }
  };

  const groups = [
    { key: 'general', label: 'Umum', icon: 'fa-globe' },
    { key: 'contact', label: 'Kontak', icon: 'fa-phone' },
    { key: 'social', label: 'Social Media', icon: 'fa-share-alt' },
    { key: 'seo', label: 'SEO', icon: 'fa-search' },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[var(--surface-1)]">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <i className="fas fa-spinner fa-spin text-3xl text-[var(--text-5)]"></i>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--surface-1)]">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-display font-bold text-[var(--text-1)] mb-2">CMS Settings</h1>
          <p className="text-[var(--text-4)] text-sm mb-8">Kelola pengaturan umum website Anda</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {groups.map(group => (
              <div key={group.key} className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-6">
                <h2 className="text-lg font-bold text-[var(--text-1)] mb-4 flex items-center gap-2">
                  <i className={`fas ${group.icon} text-[var(--text-4)]`}></i>
                  {group.label}
                </h2>
                <div className="space-y-4">
                  {defaultSettings.filter(s => s.group === group.key).map(setting => (
                    <div key={setting.key}>
                      <label className="block text-[var(--text-4)] text-sm mb-2">{setting.label}</label>
                      {setting.type === 'textarea' ? (
                        <textarea
                          value={form[setting.key] || ''}
                          onChange={(e) => setForm(prev => ({ ...prev, [setting.key]: e.target.value }))}
                          rows={3}
                          className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm"
                        />
                      ) : setting.type === 'image' ? (
                        <div className="flex items-center gap-4">
                          <input
                            type="text"
                            value={form[setting.key] || ''}
                            onChange={(e) => setForm(prev => ({ ...prev, [setting.key]: e.target.value }))}
                            className="flex-1 bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm"
                            placeholder="URL gambar atau upload"
                          />
                          <label className="px-4 py-3 bg-[var(--surface-3)] rounded-lg text-[var(--text-3)] hover:text-[var(--text-1)] cursor-pointer transition-colors text-sm whitespace-nowrap">
                            <i className="fas fa-upload mr-2"></i>Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUpload(setting.key, file);
                              }}
                            />
                          </label>
                          {form[setting.key] && (
                            <img src={form[setting.key]} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-[var(--border-2)]" />
                          )}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={form[setting.key] || ''}
                          onChange={(e) => setForm(prev => ({ ...prev, [setting.key]: e.target.value }))}
                          className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="btn-chrome px-8 py-3 rounded-md font-semibold text-sm disabled:opacity-50"
              >
                {saving ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
                {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
