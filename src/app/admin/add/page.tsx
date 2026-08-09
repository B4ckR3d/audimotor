'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PermissionGuard from '@/components/PermissionGuard';

export default function AddCarPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    transmission: 'Automatic',
    fuel: 'Bensin',
    color: '',
    description: '',
    image_url: '',
    status: 'available',
    is_featured: false,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({ ...prev, image_url: data.url }));
      } else {
        alert('Gagal mengupload gambar');
      }
    } catch {
      alert('Gagal mengupload gambar');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push('/admin');
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menyimpan');
      }
    } catch {
      alert('Gagal menyimpan mobil');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <PermissionGuard section="cars" action="write">
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-20 bg-[var(--surface-1)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-[var(--text-4)] hover:text-[var(--text-1)] mb-8 transition-colors">
            <i className="fas fa-arrow-left"></i> Kembali ke Dashboard
          </Link>

          <h1 className="text-3xl font-display font-bold text-[var(--text-1)] mb-8">Tambah Mobil Baru</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Merek *</label>
                <input
                  type="text"
                  required
                  value={form.brand}
                  onChange={(e) => updateField('brand', e.target.value)}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors"
                  placeholder="Toyota"
                />
              </div>
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Nama Model *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors"
                  placeholder="Alphard"
                />
              </div>
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Varian</label>
                <input
                  type="text"
                  value={form.model}
                  onChange={(e) => updateField('model', e.target.value)}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors"
                  placeholder="2.5 G AT"
                />
              </div>
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Tahun *</label>
                <input
                  type="number"
                  required
                  min={2000}
                  max={2030}
                  value={form.year}
                  onChange={(e) => updateField('year', Number(e.target.value))}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Harga (Rp) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.price}
                  onChange={(e) => updateField('price', Number(e.target.value))}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors"
                  placeholder="500000000"
                />
              </div>
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Kilometer *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.mileage}
                  onChange={(e) => updateField('mileage', Number(e.target.value))}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors"
                  placeholder="15000"
                />
              </div>
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Transmisi</label>
                <select
                  value={form.transmission}
                  onChange={(e) => updateField('transmission', e.target.value)}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors"
                >
                  <option>Automatic</option>
                  <option>Manual</option>
                  <option>CVT</option>
                  <option>DCT</option>
                </select>
              </div>
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Bahan Bakar</label>
                <select
                  value={form.fuel}
                  onChange={(e) => updateField('fuel', e.target.value)}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors"
                >
                  <option>Bensin</option>
                  <option>Diesel</option>
                  <option>Hybrid</option>
                  <option>Listrik</option>
                </select>
              </div>
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Warna</label>
                <input
                  type="text"
                  value={form.color}
                  onChange={(e) => updateField('color', e.target.value)}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors"
                  placeholder="Hitam Metalik"
                />
              </div>
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => updateField('status', e.target.value)}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors"
                >
                  <option value="available">Tersedia</option>
                  <option value="sold">Terjual</option>
                  <option value="featured">Featured</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[var(--text-4)] text-sm mb-2">Gambar Mobil</label>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface-2)] border border-[var(--border-1)] rounded-lg text-[var(--text-3)] hover:text-[var(--text-1)] hover:border-[var(--text-5)] transition-colors text-sm disabled:opacity-50"
                  >
                    {uploading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-cloud-upload-alt"></i>
                    )}
                    {uploading ? 'Mengupload...' : 'Upload Gambar'}
                  </button>
                  <span className="text-[var(--text-5)] text-xs">atau paste URL di bawah</span>
                </div>

                <input
                  type="text"
                  value={form.image_url}
                  onChange={(e) => updateField('image_url', e.target.value)}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm"
                  placeholder="https://images.unsplash.com/..."
                />

                {form.image_url && (
                  <div className="relative">
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-[var(--border-1)]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, image_url: '' }))}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                    >
                      <i className="fas fa-times text-sm"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[var(--text-4)] text-sm mb-2">Deskripsi</label>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
                className="w-full bg-[var(--surface-2)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors"
                placeholder="Deskripsi lengkap mobil..."
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_featured"
                checked={form.is_featured}
                onChange={(e) => updateField('is_featured', e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border-1)] bg-[var(--surface-2)]"
              />
              <label htmlFor="is_featured" className="text-[var(--text-3)] text-sm">Tandai sebagai Featured</label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving || uploading}
                className="btn-chrome px-8 py-3 rounded-md font-semibold text-sm disabled:opacity-50"
              >
                {saving ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
                {saving ? 'Menyimpan...' : 'Simpan Mobil'}
              </button>
              <Link
                href="/admin"
                className="px-8 py-3 rounded-md border border-[var(--border-1)] text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors text-sm"
              >
                Batal
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
    </PermissionGuard>
  );
}
