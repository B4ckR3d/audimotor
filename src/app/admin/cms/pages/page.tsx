'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

interface Page {
  id: number;
  slug: string;
  title: string;
  content: string;
  meta_description: string;
  is_active: boolean;
}

export default function CmsPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [editing, setEditing] = useState<Page | null>(null);
  const [form, setForm] = useState({ slug: '', title: '', content: '', meta_description: '', is_active: true });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/admin/pages');
      const data = await res.json();
      setPages(data);
    } catch {
      console.error('Gagal mengambil data halaman');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPages(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { ...form, id: editing.id } : form;
      await fetch('/api/admin/pages', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setForm({ slug: '', title: '', content: '', meta_description: '', is_active: true });
      setEditing(null);
      fetchPages();
    } catch {
      alert('Gagal menyimpan halaman');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus halaman ini?')) return;
    try {
      await fetch(`/api/admin/pages?id=${id}`, { method: 'DELETE' });
      fetchPages();
    } catch {
      alert('Gagal menghapus halaman');
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
          <h1 className="text-3xl font-display font-bold text-[var(--text-1)] mb-2">Halaman</h1>
          <p className="text-[var(--text-4)] text-sm mb-8">Kelola halaman konten website (Syarat & Ketentuan, Kebijakan Privasi, dll)</p>

          <form onSubmit={handleSubmit} className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-6 mb-8">
            <h2 className="text-lg font-bold text-[var(--text-1)] mb-4">{editing ? 'Edit Halaman' : 'Tambah Halaman Baru'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Slug (URL)</label>
                <input type="text" required value={form.slug} onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" placeholder="syarat-ketentuan" />
              </div>
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Judul</label>
                <input type="text" required value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[var(--text-4)] text-sm mb-2">Konten (HTML)</label>
              <textarea required value={form.content} onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))} rows={10} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm font-mono" placeholder="<h2>Syarat & Ketentuan</h2>&#10;<p>Isi konten di sini...</p>" />
            </div>
            <div className="mb-4">
              <label className="block text-[var(--text-4)] text-sm mb-2">Meta Description (SEO)</label>
              <input type="text" value={form.meta_description} onChange={(e) => setForm(prev => ({ ...prev, meta_description: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" placeholder="Deskripsi untuk search engine" />
            </div>
            <div className="mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm(prev => ({ ...prev, is_active: e.target.checked }))} className="w-4 h-4 rounded border-[var(--border-2)] bg-[var(--surface-1)]" />
                <span className="text-[var(--text-3)] text-sm">Aktif</span>
              </label>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-chrome px-6 py-2.5 rounded-md font-semibold text-sm disabled:opacity-50">
                {saving ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
                {editing ? 'Update' : 'Tambah'} Halaman
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({ slug: '', title: '', content: '', meta_description: '', is_active: true }); }} className="px-6 py-2.5 rounded-md border border-[var(--border-1)] text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors text-sm">
                  Batal
                </button>
              )}
            </div>
          </form>

          <div className="space-y-4">
            {pages.map(page => (
              <div key={page.id} className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-[var(--text-1)] font-bold">{page.title}</h3>
                  <p className="text-[var(--text-5)] text-xs">/{page.slug}</p>
                  {page.meta_description && <p className="text-[var(--text-4)] text-sm mt-1">{page.meta_description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${page.is_active ? 'text-green-400' : 'text-red-400'}`}>{page.is_active ? 'Aktif' : 'Nonaktif'}</span>
                  <button onClick={() => { setEditing(page); setForm({ slug: page.slug, title: page.title, content: page.content, meta_description: page.meta_description, is_active: page.is_active }); }} className="px-3 py-1.5 rounded border border-[var(--border-1)] text-[var(--text-3)] hover:text-[var(--text-1)] text-xs">Edit</button>
                  <button onClick={() => handleDelete(page.id)} className="px-3 py-1.5 rounded border border-red-900 text-red-400 hover:bg-red-900/30 text-xs">Hapus</button>
                </div>
              </div>
            ))}
            {pages.length === 0 && (
              <div className="text-center py-12 bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)]">
                <i className="fas fa-file-alt text-4xl text-[var(--text-5)] mb-4"></i>
                <p className="text-[var(--text-4)]">Belum ada halaman. Tambahkan halaman pertama!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
