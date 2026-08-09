'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import PermissionGuard from '@/components/PermissionGuard';

interface HeroSection {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  button_primary_text: string;
  button_primary_link: string;
  button_secondary_text: string;
  button_secondary_link: string;
  background_image: string;
  background_video: string;
}

export default function CmsHeroPage() {
  const [hero, setHero] = useState<HeroSection | null>(null);
  const [form, setForm] = useState({
    title: 'Masa Depan Keluarga Anda Dimulai di Sini.',
    subtitle: 'Kami menghadirkan koleksi mobil bekas premium, terawat, dan berkualitas tinggi khusus untuk kenyamanan dan keamanan perjalanan keluarga Anda.',
    badge: 'Dealer Mobil Keluarga Terpercaya',
    button_primary_text: 'Lihat Koleksi',
    button_primary_link: '/#koleksi',
    button_secondary_text: 'Konsultasi WA',
    button_secondary_link: 'https://wa.me/6281234567890',
    background_image: '',
    background_video: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch('/api/admin/hero');
        const data = await res.json();
        if (data) {
          setHero(data);
          setForm({
            title: data.title,
            subtitle: data.subtitle,
            badge: data.badge,
            button_primary_text: data.button_primary_text,
            button_primary_link: data.button_primary_link,
            button_secondary_text: data.button_secondary_text,
            button_secondary_link: data.button_secondary_link,
            background_image: data.background_image,
            background_video: data.background_video,
          });
        }
      } catch {
        console.error('Gagal mengambil data hero');
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = hero ? 'PUT' : 'POST';
      const body = hero ? { ...form, id: hero.id } : form;
      await fetch('/api/admin/hero', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      alert('Hero berhasil disimpan!');
    } catch {
      alert('Gagal menyimpan hero');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file: File, type: 'image' | 'video') => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        if (type === 'image') {
          setForm(prev => ({ ...prev, background_image: data.url }));
        } else {
          setForm(prev => ({ ...prev, background_video: data.url }));
        }
      }
    } catch {
      alert('Gagal upload file');
    }
  };

  const handleRemoveBackground = (type: 'image' | 'video') => {
    if (type === 'image') {
      setForm(prev => ({ ...prev, background_image: '' }));
    } else {
      setForm(prev => ({ ...prev, background_video: '' }));
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
    <PermissionGuard section="hero" action="write">
    <div className="flex min-h-screen bg-[var(--surface-1)]">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-display font-bold text-[var(--text-1)] mb-2">Hero Section</h1>
          <p className="text-[var(--text-4)] text-sm mb-8">Kelola konten hero section di halaman utama</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-6">
              <h2 className="text-lg font-bold text-[var(--text-1)] mb-4 flex items-center gap-2">
                <i className="fas fa-image text-[var(--text-4)]"></i>
                Background Image
              </h2>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={form.background_image}
                  onChange={(e) => setForm(prev => ({ ...prev, background_image: e.target.value }))}
                  className="flex-1 bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm"
                  placeholder="URL gambar background"
                />
                <label className="px-4 py-3 bg-[var(--surface-3)] rounded-lg text-[var(--text-3)] hover:text-[var(--text-1)] cursor-pointer transition-colors text-sm whitespace-nowrap">
                  <i className="fas fa-upload mr-2"></i>Upload
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file, 'image');
                  }} />
                </label>
                {form.background_image && (
                  <button type="button" onClick={() => handleRemoveBackground('image')} className="px-4 py-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 hover:bg-red-900/50 transition-colors text-sm whitespace-nowrap">
                    <i className="fas fa-trash mr-2"></i>Hapus
                  </button>
                )}
              </div>
              {form.background_image && (
                <div className="relative mt-4">
                  <img src={form.background_image} alt="Preview" className="w-full h-48 object-cover rounded-lg border border-[var(--border-2)]" />
                </div>
              )}
            </div>

            <div className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-6">
              <h2 className="text-lg font-bold text-[var(--text-1)] mb-4 flex items-center gap-2">
                <i className="fas fa-video text-[var(--text-4)]"></i>
                Background Video
              </h2>
              <p className="text-[var(--text-5)] text-xs mb-4">Upload video untuk background hero section. Format MP4. Jika diisi, video akan menggantikan gambar background.</p>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={form.background_video}
                  onChange={(e) => setForm(prev => ({ ...prev, background_video: e.target.value }))}
                  className="flex-1 bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm"
                  placeholder="URL video background"
                />
                <label className="px-4 py-3 bg-[var(--surface-3)] rounded-lg text-[var(--text-3)] hover:text-[var(--text-1)] cursor-pointer transition-colors text-sm whitespace-nowrap">
                  <i className="fas fa-upload mr-2"></i>Upload
                  <input type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file, 'video');
                  }} />
                </label>
                {form.background_video && (
                  <button type="button" onClick={() => handleRemoveBackground('video')} className="px-4 py-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 hover:bg-red-900/50 transition-colors text-sm whitespace-nowrap">
                    <i className="fas fa-trash mr-2"></i>Hapus
                  </button>
                )}
              </div>
              {form.background_video && (
                <div className="relative mt-4">
                  <video src={form.background_video} muted playsInline className="w-full h-48 object-cover rounded-lg border border-[var(--border-2)]" />
                </div>
              )}
            </div>

            <div className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-6">
              <h2 className="text-lg font-bold text-[var(--text-1)] mb-4 flex items-center gap-2">
                <i className="fas fa-edit text-[var(--text-4)]"></i>
                Konten Hero
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[var(--text-4)] text-sm mb-2">Badge Teks</label>
                  <input type="text" value={form.badge} onChange={(e) => setForm(prev => ({ ...prev, badge: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-[var(--text-4)] text-sm mb-2">Judul Utama</label>
                  <textarea value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} rows={2} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-[var(--text-4)] text-sm mb-2">Subtitle</label>
                  <textarea value={form.subtitle} onChange={(e) => setForm(prev => ({ ...prev, subtitle: e.target.value }))} rows={3} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" />
                </div>
              </div>
            </div>

            <div className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-6">
              <h2 className="text-lg font-bold text-[var(--text-1)] mb-4 flex items-center gap-2">
                <i className="fas fa-mouse-pointer text-[var(--text-4)]"></i>
                Tombol Aksi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--text-4)] text-sm mb-2">Teks Tombol Utama</label>
                  <input type="text" value={form.button_primary_text} onChange={(e) => setForm(prev => ({ ...prev, button_primary_text: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-[var(--text-4)] text-sm mb-2">Link Tombol Utama</label>
                  <input type="text" value={form.button_primary_link} onChange={(e) => setForm(prev => ({ ...prev, button_primary_link: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-[var(--text-4)] text-sm mb-2">Teks Tombol Sekunder</label>
                  <input type="text" value={form.button_secondary_text} onChange={(e) => setForm(prev => ({ ...prev, button_secondary_text: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-[var(--text-4)] text-sm mb-2">Link Tombol Sekunder</label>
                  <input type="text" value={form.button_secondary_link} onChange={(e) => setForm(prev => ({ ...prev, button_secondary_link: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn-chrome px-8 py-3 rounded-md font-semibold text-sm disabled:opacity-50">
              {saving ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
              {saving ? 'Menyimpan...' : 'Simpan Hero'}
            </button>
          </form>
        </div>
      </main>
    </div>
    </PermissionGuard>
  );
}
