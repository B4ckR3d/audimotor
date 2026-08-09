'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

interface ContactInfo {
  id: number;
  contact_type: string;
  contact_value: string;
  label: string;
  is_active: boolean;
  sort_order: number;
}

const contactTypes = [
  { value: 'address', label: 'Alamat', icon: 'fa-map-marker-alt' },
  { value: 'phone', label: 'Telepon', icon: 'fa-phone-alt' },
  { value: 'whatsapp', label: 'WhatsApp', icon: 'fab fa-whatsapp' },
  { value: 'email', label: 'Email', icon: 'fa-envelope' },
  { value: 'fax', label: 'Fax', icon: 'fa-fax' },
  { value: 'other', label: 'Lainnya', icon: 'fa-info-circle' },
];

export default function CmsContactPage() {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [editing, setEditing] = useState<ContactInfo | null>(null);
  const [form, setForm] = useState({ contact_type: 'address', contact_value: '', label: '', is_active: true, sort_order: 0 });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/admin/contact');
      const data = await res.json();
      setContacts(data);
    } catch {
      console.error('Gagal mengambil data kontak');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { ...form, id: editing.id } : form;
      await fetch('/api/admin/contact', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setForm({ contact_type: 'address', contact_value: '', label: '', is_active: true, sort_order: 0 });
      setEditing(null);
      fetchContacts();
    } catch {
      alert('Gagal menyimpan kontak');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus kontak ini?')) return;
    try {
      await fetch(`/api/admin/contact?id=${id}`, { method: 'DELETE' });
      fetchContacts();
    } catch {
      alert('Gagal menghapus kontak');
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
          <h1 className="text-3xl font-display font-bold text-[var(--text-1)] mb-2">Kontak</h1>
          <p className="text-[var(--text-4)] text-sm mb-8">Kelola informasi kontak showroom</p>

          <form onSubmit={handleSubmit} className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-6 mb-8">
            <h2 className="text-lg font-bold text-[var(--text-1)] mb-4">{editing ? 'Edit Kontak' : 'Tambah Kontak Baru'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Jenis Kontak</label>
                <select value={form.contact_type} onChange={(e) => setForm(prev => ({ ...prev, contact_type: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm">
                  {contactTypes.map(ct => <option key={ct.value} value={ct.value}>{ct.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[var(--text-4)] text-sm mb-2">Label</label>
                <input type="text" value={form.label} onChange={(e) => setForm(prev => ({ ...prev, label: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" placeholder="Kantor Pusat" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[var(--text-4)] text-sm mb-2">Nilai Kontak</label>
              <input type="text" required value={form.contact_value} onChange={(e) => setForm(prev => ({ ...prev, contact_value: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" placeholder="021-555-0123" />
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
                {editing ? 'Update' : 'Tambah'} Kontak
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({ contact_type: 'address', contact_value: '', label: '', is_active: true, sort_order: 0 }); }} className="px-6 py-2.5 rounded-md border border-[var(--border-1)] text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors text-sm">
                  Batal
                </button>
              )}
            </div>
          </form>

          <div className="space-y-4">
            {contacts.map(c => {
              const ct = contactTypes.find(t => t.value === c.contact_type);
              return (
                <div key={c.id} className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--surface-3)] rounded-full flex items-center justify-center">
                      <i className={`fas ${ct?.icon || 'fa-info-circle'} text-[var(--text-3)]`}></i>
                    </div>
                    <div>
                      <p className="text-[var(--text-5)] text-xs">{ct?.label || c.contact_type} {c.label && `- ${c.label}`}</p>
                      <p className="text-[var(--text-1)] font-medium">{c.contact_value}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${c.is_active ? 'text-green-400' : 'text-red-400'}`}>{c.is_active ? 'Aktif' : 'Nonaktif'}</span>
                    <button onClick={() => { setEditing(c); setForm({ contact_type: c.contact_type, contact_value: c.contact_value, label: c.label, is_active: c.is_active, sort_order: c.sort_order }); }} className="px-3 py-1.5 rounded border border-[var(--border-1)] text-[var(--text-3)] hover:text-[var(--text-1)] text-xs">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="px-3 py-1.5 rounded border border-red-900 text-red-400 hover:bg-red-900/30 text-xs">Hapus</button>
                  </div>
                </div>
              );
            })}
            {contacts.length === 0 && (
              <div className="text-center py-12 bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)]">
                <i className="fas fa-phone text-4xl text-[var(--text-5)] mb-4"></i>
                <p className="text-[var(--text-4)]">Belum ada kontak. Tambahkan kontak pertama!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
