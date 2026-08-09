'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  sort_order: number;
  is_active: boolean;
}

export default function CmsGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState({ title: '', description: '', image_url: '', category: 'showroom', sort_order: 0, is_active: true });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/gallery');
      const data = await res.json();
      setItems(data);
    } catch {
      console.error('Gagal mengambil data gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { ...form, id: editing.id } : form;
      await fetch('/api/admin/gallery', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setForm({ title: '', description: '', image_url: '', category: 'showroom', sort_order: 0, is_active: true });
      setEditing(null);
      fetchItems();
    } catch {
      alert('Gagal menyimpan gambar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus gambar ini?')) return;
    try {
      await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' });
      fetchItems();
    } catch {
      alert('Gagal menghapus gambar');
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setForm(prev => ({ ...prev, image_url: data.url }));
      }
    } catch {
      alert('Gagal upload file');
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
        <div className="max-w-5xl">
          <h1 className="text-3xl font-display font-bold text-[var(--text-1)] mb-2">Gallery</h1>
          <p className="text-[var(--text-4)] text-sm mb-8">Kelola gambar showroom dan gallery website</p>

          <form onSubmit={handleSubmit} className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-6 mb-8">
            <h2 className="text-lg font-bold text-[var(--text-1)] mb-4">{editing ? 'Edit Gambar' : 'Tambah Gambar Baru'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Judul</label>
                <input type="text" required value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Kategori</label>
                <select value={form.category} onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm">
                  <option value="showroom">Showroom</option>
                  <option value="mobil">Mobil</option>
                  <option value="interior">Interior</option>
                  <option value="eksterior">Eksterior</option>
                  <option value="promo">Promo</option>
                  <option value="general">Umum</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[var(--text-4)] text-sm mb-2">Deskripsi</label>
              <input type="text" value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-[var(--text-4)] text-sm mb-2">Gambar</label>
              <div className="flex items-center gap-4">
                <input type="text" required value={form.image_url} onChange={(e) => setForm(prev => ({ ...prev, image_url: e.target.value }))} className="flex-1 bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" placeholder="URL gambar" />
                <label className="px-4 py-3 bg-[var(--surface-3)] rounded-lg text-[var(--text-3)] hover:text-[var(--text-1)] cursor-pointer transition-colors text-sm whitespace-nowrap">
                  <i className="fas fa-upload mr-2"></i>Upload
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleUpload(file); }} />
                </label>
              </div>
              {form.image_url && <img src={form.image_url} alt="Preview" className="mt-4 w-48 h-32 object-cover rounded-lg border border-[var(--border-2)]" />}
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
                {editing ? 'Update' : 'Tambah'} Gambar
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({ title: '', description: '', image_url: '', category: 'showroom', sort_order: 0, is_active: true }); }} className="px-6 py-2.5 rounded-md border border-[var(--border-1)] text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors text-sm">
                  Batal
                </button>
              )}
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <div key={item.id} className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] overflow-hidden">
                <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-[var(--text-1)] font-bold text-sm">{item.title}</h3>
                    <span className="text-[var(--text-5)] text-xs">{item.category}</span>
                  </div>
                  {item.description && <p className="text-[var(--text-4)] text-xs mb-3">{item.description}</p>}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${item.is_active ? 'text-green-400' : 'text-red-400'}`}>
                      {item.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(item); setForm({ title: item.title, description: item.description, image_url: item.image_url, category: item.category, sort_order: item.sort_order, is_active: item.is_active }); }} className="px-2 py-1 rounded border border-[var(--border-1)] text-[var(--text-3)] hover:text-[var(--text-1)] text-xs">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="px-2 py-1 rounded border border-red-900 text-red-400 hover:bg-red-900/30 text-xs">Hapus</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-span-full text-center py-12 bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)]">
                <i className="fas fa-images text-4xl text-[var(--text-5)] mb-4"></i>
                <p className="text-[var(--text-4)]">Belum ada gambar. Tambahkan gambar pertama Anda!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
