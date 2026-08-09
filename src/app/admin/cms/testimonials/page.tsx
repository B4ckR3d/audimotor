'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

interface Testimonial {
  id: number;
  customer_name: string;
  customer_avatar: string;
  rating: number;
  comment: string;
  car_purchased: string;
  is_active: boolean;
  sort_order: number;
}

export default function CmsTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ customer_name: '', customer_avatar: '', rating: 5, comment: '', car_purchased: '', is_active: true, sort_order: 0 });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      setTestimonials(data);
    } catch {
      console.error('Gagal mengambil data testimonial');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { ...form, id: editing.id } : form;
      await fetch('/api/admin/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setForm({ customer_name: '', customer_avatar: '', rating: 5, comment: '', car_purchased: '', is_active: true, sort_order: 0 });
      setEditing(null);
      fetchTestimonials();
    } catch {
      alert('Gagal menyimpan testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus testimonial ini?')) return;
    try {
      await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      fetchTestimonials();
    } catch {
      alert('Gagal menghapus testimonial');
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
          <h1 className="text-3xl font-display font-bold text-[var(--text-1)] mb-2">Testimoni Pelanggan</h1>
          <p className="text-[var(--text-4)] text-sm mb-8">Kelola testimoni dari pelanggan yang puas</p>

          <form onSubmit={handleSubmit} className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-6 mb-8">
            <h2 className="text-lg font-bold text-[var(--text-1)] mb-4">{editing ? 'Edit Testimonial' : 'Tambah Testimonial Baru'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Nama Pelanggan</label>
                <input type="text" required value={form.customer_name} onChange={(e) => setForm(prev => ({ ...prev, customer_name: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Mobil yang Dibeli</label>
                <input type="text" value={form.car_purchased} onChange={(e) => setForm(prev => ({ ...prev, car_purchased: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" placeholder="Toyota Alphard 2021" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[var(--text-4)] text-sm mb-2">Rating (1-5)</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(star => (
                  <button key={star} type="button" onClick={() => setForm(prev => ({ ...prev, rating: star }))} className={`text-2xl ${star <= form.rating ? 'text-yellow-400' : 'text-[var(--text-5)]'}`}>
                    <i className="fas fa-star"></i>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[var(--text-4)] text-sm mb-2">Testimonial</label>
              <textarea required value={form.comment} onChange={(e) => setForm(prev => ({ ...prev, comment: e.target.value }))} rows={3} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" placeholder="Ceritakan pengalaman Anda..." />
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
                {editing ? 'Update' : 'Tambah'} Testimonial
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({ customer_name: '', customer_avatar: '', rating: 5, comment: '', car_purchased: '', is_active: true, sort_order: 0 }); }} className="px-6 py-2.5 rounded-md border border-[var(--border-1)] text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors text-sm">
                  Batal
                </button>
              )}
            </div>
          </form>

          <div className="space-y-4">
            {testimonials.map(t => (
              <div key={t.id} className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-[var(--text-1)] font-bold">{t.customer_name}</h3>
                    {t.car_purchased && <p className="text-[var(--text-5)] text-xs">Beli: {t.car_purchased}</p>}
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => <i key={i} className="fas fa-star text-yellow-400 text-xs"></i>)}
                  </div>
                </div>
                <p className="text-[var(--text-4)] text-sm mb-3">&ldquo;{t.comment}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${t.is_active ? 'text-green-400' : 'text-red-400'}`}>{t.is_active ? 'Aktif' : 'Nonaktif'}</span>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(t); setForm({ customer_name: t.customer_name, customer_avatar: t.customer_avatar, rating: t.rating, comment: t.comment, car_purchased: t.car_purchased, is_active: t.is_active, sort_order: t.sort_order }); }} className="px-3 py-1.5 rounded border border-[var(--border-1)] text-[var(--text-3)] hover:text-[var(--text-1)] text-xs">Edit</button>
                    <button onClick={() => handleDelete(t.id)} className="px-3 py-1.5 rounded border border-red-900 text-red-400 hover:bg-red-900/30 text-xs">Hapus</button>
                  </div>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && (
              <div className="text-center py-12 bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)]">
                <i className="fas fa-quote-right text-4xl text-[var(--text-5)] mb-4"></i>
                <p className="text-[var(--text-4)]">Belum ada testimoni. Tambahkan testimoni pertama!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
