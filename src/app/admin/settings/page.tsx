'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import PermissionGuard from '@/components/PermissionGuard';
import { User } from '@/types';

interface Profile {
  id: number;
  username: string;
  full_name: string;
  role: string;
  created_at: string;
}

interface Role {
  id: number;
  name: string;
  label: string;
  description: string;
  permissions: Record<string, string>;
  is_active: number;
}

const CMS_SECTIONS = [
  { key: 'hero', label: 'Hero Section' },
  { key: 'features', label: 'Fitur' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'testimonials', label: 'Testimoni' },
  { key: 'promotions', label: 'Promosi' },
  { key: 'pages', label: 'Halaman' },
  { key: 'contact', label: 'Kontak' },
  { key: 'social', label: 'Social Media' },
  { key: 'cars', label: 'Mobil' },
  { key: 'users', label: 'Manajemen User' },
  { key: 'roles', label: 'Konfigurasi Role' },
  { key: 'settings', label: 'Pengaturan' },
];

const PERM_OPTIONS = [
  { value: 'none', label: 'Tidak Ada', dot: 'bg-gray-500' },
  { value: 'read', label: 'Lihat Saja', dot: 'bg-yellow-400' },
  { value: 'write', label: 'Lihat & Edit', dot: 'bg-green-400' },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'roles'>('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileForm, setProfileForm] = useState({ full_name: '', current_password: '', new_password: '', confirm_password: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({ username: '', password: '', full_name: '', role: 'editor', is_active: true });
  const [savingUser, setSavingUser] = useState(false);

  const [roles, setRoles] = useState<Role[]>([]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleForm, setRoleForm] = useState({ name: '', label: '', description: '', permissions: {} as Record<string, string>, is_active: true });
  const [savingRole, setSavingRole] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setProfileForm(prev => ({ ...prev, full_name: data.full_name || '' }));
      }
    } catch { /* empty */ }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setUsers(data);
      }
    } catch { /* empty */ }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/roles');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setRoles(data.map((r: Role) => ({
            ...r,
            permissions: typeof r.permissions === 'string' ? JSON.parse(r.permissions) : r.permissions || {},
          })));
        }
      }
    } catch { /* empty */ }
  }, []);

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchProfile(), fetchUsers(), fetchRoles()]);
      setLoading(false);
    };
    load();
  }, [fetchProfile, fetchUsers, fetchRoles]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profileForm.new_password && profileForm.new_password !== profileForm.confirm_password) {
      setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok' });
      return;
    }
    setSavingProfile(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/admin/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        setProfileForm(prev => ({ ...prev, current_password: '', new_password: '', confirm_password: '' }));
        fetchProfile();
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch {
      setMessage({ type: 'error', text: 'Gagal memperbarui profil' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser && !userForm.password) return;
    setSavingUser(true);
    try {
      const method = editingUser ? 'PUT' : 'POST';
      const body = editingUser ? { ...userForm, id: editingUser.id } : userForm;
      const res = await fetch('/api/admin/users', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setUserForm({ username: '', password: '', full_name: '', role: 'editor', is_active: true });
        setEditingUser(null);
        fetchUsers();
      } else {
        alert(data.error);
      }
    } catch { /* empty */ } finally {
      setSavingUser(false);
    }
  };

  const handleUserDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return;
    const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchUsers();
  };

  const handleUserToggle = async (user: User) => {
    await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user, is_active: !user.is_active }),
    });
    fetchUsers();
  };

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingRole(true);
    try {
      const method = editingRole ? 'PUT' : 'POST';
      const body = editingRole ? { ...roleForm, id: editingRole.id } : roleForm;
      const res = await fetch('/api/admin/roles', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setRoleForm({ name: '', label: '', description: '', permissions: {}, is_active: true });
        setEditingRole(null);
        fetchRoles();
      } else {
        alert(data.error);
      }
    } catch { /* empty */ } finally {
      setSavingRole(false);
    }
  };

  const handleRoleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus role ini?')) return;
    const res = await fetch(`/api/admin/roles?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchRoles();
  };

  const handleRoleToggle = async (role: Role) => {
    await fetch('/api/admin/roles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...role, is_active: !role.is_active }),
    });
    fetchRoles();
  };

  const updateRolePermission = (section: string, value: string) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: { ...prev.permissions, [section]: value },
    }));
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

  const tabs = [
    { key: 'profile' as const, label: 'Profil Saya', icon: 'fa-user' },
    { key: 'users' as const, label: 'Manajemen User', icon: 'fa-users' },
    { key: 'roles' as const, label: 'Konfigurasi Role', icon: 'fa-user-shield' },
  ];

  return (
    <PermissionGuard section="settings" action="write">
    <div className="flex min-h-screen bg-[var(--surface-1)]">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-display font-bold text-[var(--text-1)] mb-2">Pengaturan</h1>
          <p className="text-[var(--text-4)] text-sm mb-6">Kelola profil, user, dan hak akses role</p>

          <div className="flex gap-1 mb-8 bg-[var(--surface-2)] rounded-lg border border-[var(--border-1)] p-1">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-[var(--surface-3)] text-[var(--text-1)]' : 'text-[var(--text-4)] hover:text-[var(--text-1)]'}`}>
                <i className={`fas ${tab.icon} text-xs`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-lg border text-sm ${message.type === 'success' ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-red-900/30 border-red-800 text-red-400'}`}>
              <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
              {message.text}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-6">
                <h2 className="text-lg font-bold text-[var(--text-1)] mb-4 flex items-center gap-2"><i className="fas fa-user text-[var(--text-4)]"></i> Informasi Akun</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-[var(--text-4)]">Username</span><span className="text-[var(--text-1)] font-medium">{profile?.username}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--text-4)]">Role</span><span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-900/50 text-blue-400 border border-blue-800 capitalize">{profile?.role}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--text-4)]">Terdaftar</span><span className="text-[var(--text-1)]">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span></div>
                </div>
              </div>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-6">
                  <h2 className="text-lg font-bold text-[var(--text-1)] mb-4 flex items-center gap-2"><i className="fas fa-id-card text-[var(--text-4)]"></i> Profil</h2>
                  <label className="block text-[var(--text-4)] text-sm mb-2">Nama Lengkap</label>
                  <input type="text" value={profileForm.full_name} onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" />
                </div>
                <div className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-6">
                  <h2 className="text-lg font-bold text-[var(--text-1)] mb-4 flex items-center gap-2"><i className="fas fa-lock text-[var(--text-4)]"></i> Ubah Password</h2>
                  <p className="text-[var(--text-5)] text-xs mb-4">Kosongkan jika tidak ingin mengubah password</p>
                  <div className="space-y-4">
                    <div><label className="block text-[var(--text-4)] text-sm mb-2">Password Lama</label><input type="password" value={profileForm.current_password} onChange={(e) => setProfileForm(prev => ({ ...prev, current_password: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" /></div>
                    <div><label className="block text-[var(--text-4)] text-sm mb-2">Password Baru</label><input type="password" value={profileForm.new_password} onChange={(e) => setProfileForm(prev => ({ ...prev, new_password: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" /></div>
                    <div><label className="block text-[var(--text-4)] text-sm mb-2">Konfirmasi Password Baru</label><input type="password" value={profileForm.confirm_password} onChange={(e) => setProfileForm(prev => ({ ...prev, confirm_password: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" /></div>
                  </div>
                </div>
                <button type="submit" disabled={savingProfile} className="btn-chrome px-8 py-3 rounded-md font-semibold text-sm disabled:opacity-50">
                  {savingProfile ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
                  {savingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <form onSubmit={handleUserSubmit} className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-6">
                <h2 className="text-lg font-bold text-[var(--text-1)] mb-4">{editingUser ? 'Edit User' : 'Tambah User Baru'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-[var(--text-4)] text-sm mb-2">Username</label><input type="text" required value={userForm.username} onChange={(e) => setUserForm(prev => ({ ...prev, username: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" /></div>
                  <div><label className="block text-[var(--text-4)] text-sm mb-2">{editingUser ? 'Password Baru (kosongkan jika tidak ubah)' : 'Password'}</label><input type="password" value={userForm.password} onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" {...(!editingUser ? { required: true } : {})} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-[var(--text-4)] text-sm mb-2">Nama Lengkap</label><input type="text" value={userForm.full_name} onChange={(e) => setUserForm(prev => ({ ...prev, full_name: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" /></div>
                  <div><label className="block text-[var(--text-4)] text-sm mb-2">Role</label><select value={userForm.role} onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm">{roles.filter(r => r.is_active).map(r => (<option key={r.name} value={r.name}>{r.label}</option>))}</select></div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={savingUser} className="btn-chrome px-6 py-2.5 rounded-md font-semibold text-sm disabled:opacity-50">{savingUser ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}{editingUser ? 'Update' : 'Tambah'} User</button>
                  {editingUser && <button type="button" onClick={() => { setEditingUser(null); setUserForm({ username: '', password: '', full_name: '', role: 'editor', is_active: true }); }} className="px-6 py-2.5 rounded-md border border-[var(--border-1)] text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors text-sm">Batal</button>}
                </div>
              </form>

              <div className="space-y-3">
                {users.map(user => (
                  <div key={user.id} className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--surface-3)] border border-[var(--border-1)] flex items-center justify-center"><i className="fas fa-user text-[var(--text-4)] text-sm"></i></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-[var(--text-1)] font-bold">{user.username}</h3>
                            {profile?.id === user.id && <span className="text-xs text-[var(--text-5)]">(Anda)</span>}
                          </div>
                          <p className="text-[var(--text-5)] text-xs">{user.full_name || 'Tanpa nama'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${user.role === 'admin' ? 'bg-blue-900/50 text-blue-400 border border-blue-800' : 'bg-green-900/50 text-green-400 border border-green-800'}`}>{user.role}</span>
                        <span className={`text-xs ${user.is_active ? 'text-green-400' : 'text-red-400'}`}>{user.is_active ? 'Aktif' : 'Nonaktif'}</span>
                        {profile?.id !== user.id && (
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingUser(user); setUserForm({ username: user.username, password: '', full_name: user.full_name, role: user.role, is_active: user.is_active }); }} className="px-3 py-1.5 rounded border border-[var(--border-1)] text-[var(--text-3)] hover:text-[var(--text-1)] text-xs">Edit</button>
                            <button onClick={() => handleUserToggle(user)} className={`px-3 py-1.5 rounded border text-xs ${user.is_active ? 'border-yellow-800 text-yellow-400 hover:bg-yellow-900/30' : 'border-green-800 text-green-400 hover:bg-green-900/30'}`}>{user.is_active ? 'Nonaktifkan' : 'Aktifkan'}</button>
                            <button onClick={() => handleUserDelete(user.id)} className="px-3 py-1.5 rounded border border-red-900 text-red-400 hover:bg-red-900/30 text-xs">Hapus</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {users.length === 0 && <div className="text-center py-12 bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)]"><p className="text-[var(--text-4)]">Belum ada user.</p></div>}
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-6">
              <form onSubmit={handleRoleSubmit} className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-6">
                <h2 className="text-lg font-bold text-[var(--text-1)] mb-4">{editingRole ? 'Edit Role' : 'Tambah Role Baru'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-[var(--text-4)] text-sm mb-2">Role Name</label><input type="text" required value={roleForm.name} onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value.toLowerCase().replace(/\s+/g, '_') }))} placeholder="contoh: manager" disabled={!!editingRole} className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm disabled:opacity-50" /></div>
                  <div><label className="block text-[var(--text-4)] text-sm mb-2">Label</label><input type="text" required value={roleForm.label} onChange={(e) => setRoleForm(prev => ({ ...prev, label: e.target.value }))} placeholder="contoh: Manager" className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" /></div>
                </div>
                <div className="mb-4"><label className="block text-[var(--text-4)] text-sm mb-2">Deskripsi</label><input type="text" value={roleForm.description} onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Deskripsi role ini..." className="w-full bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 text-[var(--text-1)] focus:outline-none focus:border-[var(--text-5)] transition-colors text-sm" /></div>

                <div className="mb-6">
                  <label className="block text-[var(--text-4)] text-sm mb-3 font-medium">Hak Akses per Menu CMS</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {CMS_SECTIONS.map(sec => {
                      const currentPerm = roleForm.permissions[sec.key] || 'none';
                      return (
                        <div key={sec.key} className="flex items-center justify-between bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-4 py-3 hover:border-[var(--border-2)] transition-colors">
                          <span className="text-[var(--text-3)] text-sm">{sec.label}</span>
                          <div className="relative">
                            <select
                              value={currentPerm}
                              onChange={(e) => updateRolePermission(sec.key, e.target.value)}
                              className="appearance-none bg-[var(--surface-2)] border border-[var(--border-1)] rounded-md px-3 py-1.5 pr-8 text-xs text-[var(--text-2)] focus:outline-none focus:border-[var(--text-5)] cursor-pointer hover:border-[var(--text-5)] transition-colors"
                            >
                              {PERM_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                              ))}
                            </select>
                            <i className="fas fa-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-5)] pointer-events-none"></i>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={savingRole} className="btn-chrome px-6 py-2.5 rounded-md font-semibold text-sm disabled:opacity-50">{savingRole ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}{editingRole ? 'Update' : 'Tambah'} Role</button>
                  {editingRole && <button type="button" onClick={() => { setEditingRole(null); setRoleForm({ name: '', label: '', description: '', permissions: {}, is_active: true }); }} className="px-6 py-2.5 rounded-md border border-[var(--border-1)] text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors text-sm">Batal</button>}
                </div>
              </form>

              <div className="space-y-3">
                {roles.map(role => (
                  <div key={role.id} className="bg-[var(--surface-2)] rounded-xl border border-[var(--border-1)] p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--surface-3)] border border-[var(--border-1)] flex items-center justify-center"><i className="fas fa-user-shield text-[var(--text-4)] text-sm"></i></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-[var(--text-1)] font-bold">{role.label}</h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[var(--text-3)]">{role.name}</span>
                            {!role.is_active && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">Nonaktif</span>}
                            {(role.name === 'admin' || role.name === 'editor') && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[var(--text-5)]">Default</span>}
                          </div>
                          <p className="text-[var(--text-5)] text-xs mt-1">{role.description || '—'}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {CMS_SECTIONS.filter(s => role.permissions[s.key] && role.permissions[s.key] !== 'none').map(s => (
                              <span key={s.key} className={`text-[10px] px-1.5 py-0.5 rounded ${role.permissions[s.key] === 'write' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>{s.label}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleRoleToggle(role)} className={`w-10 h-6 rounded-full transition-colors relative ${role.is_active ? 'bg-green-600' : 'bg-[var(--surface-3)]'}`}><div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${role.is_active ? 'translate-x-5' : 'translate-x-1'}`}></div></button>
                        <button onClick={() => { setEditingRole(role); setRoleForm({ name: role.name, label: role.label, description: role.description, permissions: role.permissions, is_active: !!role.is_active }); }} className="w-10 h-10 rounded-lg border border-[var(--border-1)] flex items-center justify-center text-[var(--text-4)] hover:text-[var(--text-1)] hover:border-[var(--text-5)] transition-colors"><i className="fas fa-pen text-xs"></i></button>
                        {role.name !== 'admin' && role.name !== 'editor' && <button onClick={() => handleRoleDelete(role.id)} className="w-10 h-10 rounded-lg border border-[var(--border-1)] flex items-center justify-center text-[var(--text-4)] hover:text-red-400 hover:border-red-600 transition-colors"><i className="fas fa-trash text-xs"></i></button>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
    </PermissionGuard>
  );
}
