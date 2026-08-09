'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

interface Promotion {
  id: number;
  title: string;
  description: string;
  image_url: string;
  discount_text: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export default function CmsPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [form, setForm] = useState({ title: '', description: '', image_url: '', discount_text: '', start_date: '', end_date: '', is_active: true });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPromotions = async () => {
    try {
      const res = await fetch('/api/admin/promotions');
      const data = await res.json();
      setPromotions(data);
    } catch {
      console.error('Gagal mengambil data promosi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPromotions(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { ...form, id: editing.id } : form;
      await fetch('/api/admin/promotions', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setForm({ title: '', description: '', image_url: '', discount_text: '', start_date: '', end_date: '', is_active: true });
      setEditing(null);
      fetchPromotions();
    } catch {
      alert('Gagal menyimpan promosi');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus promosi ini?')) return;
    try {
      await fetch(`/api/admin/promotions?id=${id}`, { method: 'DELETE' });
      fetchPromotions();
    } catch {
      alert('Gagal menghapus promosi');
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
          <h1 className="text-3xl font-display font-bold text-[var(--text-1)] mb-2">Promosi</h1>
          <p className="text-[var(--text-4)] text-sm mb-8">Kelola promosi dan penawaran spesial</p>

          <form onSubmit={handleSubmit} className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-6 mb-8">
            <h2 className="text-lg font-bold text-[var(--text-1)] mb-4">{editing ? 'Edit Promosi' : 'Tambah Promosi Baru'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Judul Promosi</label>
                <input type="text" required value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Teks Diskon</label>
                <input type="text" value={form.discount_text} onChange={(e) => setForm(prev => ({ ...prev, discount_text: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" placeholder="Hemat Rp 50 Juta!" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[var(--text-4)] text-sm mb-2">Deskripsi</label>
              <textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} rows={3} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Tanggal Mulai</label>
                <input type="date" value={form.start_date} onChange={(e) => setForm(prev => ({ ...prev, start_date: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Tanggal Berakhir</label>
                <input type="date" value={form.end_date} onChange={(e) => setForm(prev => ({ ...prev, end_date: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[var(--text-4)] text-sm mb-2">Gambar Promosi</label>
              <input type="text" value={form.image_url} onChange={(e) => setForm(prev => ({ ...prev, image_url: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" placeholder="URL gambar" />
              {form.image_url && <img src={form.image_url} alt="Preview" className="mt-4 w-48 h-32 object-cover rounded-lg border border-[var(--border-2)]" />}
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
                {editing ? 'Update' : 'Tambah'} Promosi
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({ title: '', description: '', image_url: '', discount_text: '', start_date: '', end_date: '', is_active: true }); }} className="px-6 py-2.5 rounded-md border border-[var(--border-1)] text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors text-sm">
                  Batal
                </button>
              )}
            </div>
          </form>

          <div className="space-y-4">
            {promotions.map(p => (
              <div key={p.id} className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-4 flex items-center gap-4">
                {p.image_url && <img src={p.image_url} alt={p.title} className="w-24 h-16 object-cover rounded-lg" />}
                <div className="flex-1">
                  <h3 className="text-[var(--text-1)] font-bold">{p.title}</h3>
                  {p.discount_text && <span className="text-green-400 text-xs font-bold">{p.discount_text}</span>}
                  {p.description && <p className="text-[var(--text-4)] text-sm mt-1">{p.description}</p>}
                  {(p.start_date || p.end_date) && (
                    <p className="text-[var(--text-5)] text-xs mt-1">
                      {p.start_date && `Mulai: ${p.start_date}`}
                      {p.start_date && p.end_date && ' | '}
                      {p.end_date && `Berakhir: ${p.end_date}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${p.is_active ? 'text-green-400' : 'text-red-400'}`}>{p.is_active ? 'Aktif' : 'Nonaktif'}</span>
                  <button onClick={() => { setEditing(p); setForm({ title: p.title, description: p.description, image_url: p.image_url, discount_text: p.discount_text, start_date: p.start_date || '', end_date: p.end_date || '', is_active: p.is_active }); }} className="px-3 py-1.5 rounded border border-[var(--border-1)] text-[var(--text-3)] hover:text-[var(--text-1)] text-xs">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 rounded border border-red-900 text-red-400 hover:bg-red-900/30 text-xs">Hapus</button>
                </div>
              </div>
            ))}
            {promotions.length === 0 && (
              <div className="text-center py-12 bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)]">
                <i className="fas fa-tags text-4xl text-[var(--text-5)] mb-4"></i>
                <p className="text-[var(--text-4)]">Belum ada promosi. Tambahkan promosi pertama!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
