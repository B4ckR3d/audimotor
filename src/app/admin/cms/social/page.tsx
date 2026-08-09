'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
}

const platformOptions = [
  { value: 'instagram', label: 'Instagram', icon: 'fab fa-instagram' },
  { value: 'facebook', label: 'Facebook', icon: 'fab fa-facebook-f' },
  { value: 'youtube', label: 'YouTube', icon: 'fab fa-youtube' },
  { value: 'tiktok', label: 'TikTok', icon: 'fab fa-tiktok' },
  { value: 'twitter', label: 'Twitter/X', icon: 'fab fa-x-twitter' },
  { value: 'linkedin', label: 'LinkedIn', icon: 'fab fa-linkedin-in' },
  { value: 'whatsapp', label: 'WhatsApp', icon: 'fab fa-whatsapp' },
];

export default function CmsSocialPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [form, setForm] = useState({ platform: 'instagram', url: '', icon: 'fab fa-instagram', is_active: true, sort_order: 0 });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/admin/social');
      const data = await res.json();
      setLinks(data);
    } catch {
      console.error('Gagal mengambil data social links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLinks(); }, []);

  const handlePlatformChange = (platform: string) => {
    const p = platformOptions.find(o => o.value === platform);
    setForm(prev => ({ ...prev, platform, icon: p?.icon || '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { ...form, id: editing.id } : form;
      await fetch('/api/admin/social', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setForm({ platform: 'instagram', url: '', icon: 'fab fa-instagram', is_active: true, sort_order: 0 });
      setEditing(null);
      fetchLinks();
    } catch {
      alert('Gagal menyimpan social link');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus social link ini?')) return;
    try {
      await fetch(`/api/admin/social?id=${id}`, { method: 'DELETE' });
      fetchLinks();
    } catch {
      alert('Gagal menghapus social link');
    }
  };

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
          <h1 className="text-3xl font-display font-bold text-[var(--text-1)] mb-2">Social Media</h1>
          <p className="text-[var(--text-4)] text-sm mb-8">Kelola link media sosial showroom</p>

          <form onSubmit={handleSubmit} className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-6 mb-8">
            <h2 className="text-lg font-bold text-[var(--text-1)] mb-4">{editing ? 'Edit Social Link' : 'Tambah Social Link Baru'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Platform</label>
                <select value={form.platform} onChange={(e) => handlePlatformChange(e.target.value)} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm">
                  {platformOptions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">URL</label>
                <input type="url" required value={form.url} onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" placeholder="https://instagram.com/audimotor" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Urutan</label>
                <input type="number" value={form.sort_order} onChange={(e) => setForm(prev => ({ ...prev, sort_order: Number(e.target.value) }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm(prev => ({ ...prev, is_active: e.target.checked }))} className="w-4 h-4 rounded border-[var(--border-2)] bg-[var(--surface-1)]" />
                  <span className="text-[var(--text-3)] text-sm">Aktif</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-chrome px-6 py-2.5 rounded-md font-semibold text-sm disabled:opacity-50">
                {saving ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
                {editing ? 'Update' : 'Tambah'} Link
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({ platform: 'instagram', url: '', icon: 'fab fa-instagram', is_active: true, sort_order: 0 }); }} className="px-6 py-2.5 rounded-md border border-[var(--border-1)] text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors text-sm">
                  Batal
                </button>
              )}
            </div>
          </form>

          <div className="space-y-4">
            {links.map(link => {
              const p = platformOptions.find(o => o.value === link.platform);
              return (
                <div key={link.id} className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--surface-3)] rounded-full flex items-center justify-center">
                      <i className={`${link.icon || p?.icon || 'fab fa-globe'} text-[var(--text-3)] text-lg`}></i>
                    </div>
                    <div>
                      <p className="text-[var(--text-1)] font-medium">{p?.label || link.platform}</p>
                      <p className="text-[var(--text-4)] text-sm truncate max-w-md">{link.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${link.is_active ? 'text-green-400' : 'text-red-400'}`}>{link.is_active ? 'Aktif' : 'Nonaktif'}</span>
                    <button onClick={() => { setEditing(link); setForm({ platform: link.platform, url: link.url, icon: link.icon, is_active: link.is_active, sort_order: link.sort_order }); }} className="px-3 py-1.5 rounded border border-[var(--border-1)] text-[var(--text-3)] hover:text-[var(--text-1)] text-xs">Edit</button>
                    <button onClick={() => handleDelete(link.id)} className="px-3 py-1.5 rounded border border-red-900 text-red-400 hover:bg-red-900/30 text-xs">Hapus</button>
                  </div>
                </div>
              );
            })}
            {links.length === 0 && (
              <div className="text-center py-12 bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)]">
                <i className="fas fa-share-alt text-4xl text-[var(--text-5)] mb-4"></i>
                <p className="text-[var(--text-4)]">Belum ada social media. Tambahkan link pertama!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
