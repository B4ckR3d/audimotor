'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLang } from '@/contexts/LanguageContext';

interface UserData {
  username: string;
  full_name: string;
  role: string;
  permissions?: Record<string, string>;
}

const menuItems = [
  { href: '/admin', labelKey: 'admin.dashboard', icon: 'fa-tachometer-alt', section: '' },
  { href: '/admin/cms', labelKey: 'admin.cmsSettings', icon: 'fa-cog', section: '' },
  { href: '/admin/cms/hero', labelKey: 'admin.hero', icon: 'fa-image', section: 'hero' },
  { href: '/admin/cms/features', labelKey: 'admin.features', icon: 'fa-star', section: 'features' },
  { href: '/admin/cms/gallery', labelKey: 'admin.gallery', icon: 'fa-images', section: 'gallery' },
  { href: '/admin/cms/testimonials', labelKey: 'admin.testimonials', icon: 'fa-quote-right', section: 'testimonials' },
  { href: '/admin/cms/promotions', labelKey: 'admin.promotions', icon: 'fa-tags', section: 'promotions' },
  { href: '/admin/cms/pages', labelKey: 'admin.pages', icon: 'fa-file-alt', section: 'pages' },
  { href: '/admin/cms/contact', labelKey: 'admin.contact', icon: 'fa-phone', section: 'contact' },
  { href: '/admin/cms/social', labelKey: 'admin.social', icon: 'fa-share-alt', section: 'social' },
  { href: '/admin/add', labelKey: 'admin.addCar', icon: 'fa-plus-circle', section: 'cars' },
  { href: '/admin/settings', labelKey: 'admin.settings', icon: 'fa-user-cog', section: 'settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLang();
  const [user, setUser] = useState<UserData | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const hasAccess = (section: string) => {
    if (!section) return true;
    if (user?.role === 'admin') return true;
    const perm = user?.permissions?.[section];
    return perm === 'read' || perm === 'write';
  };

  const canWrite = (section: string) => {
    if (user?.role === 'admin') return true;
    return user?.permissions?.[section] === 'write';
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  const visibleItems = menuItems.filter(item => hasAccess(item.section));

  return (
    <aside className="w-64 bg-[var(--surface-1)] border-r border-[var(--border-1)] min-h-screen flex-shrink-0 flex flex-col">
      <div className="p-6 border-b border-[var(--border-1)]">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[var(--border-2)] flex items-center justify-center bg-[var(--surface-2)]">
            <i className="fas fa-car-side text-[var(--text-4)] text-sm"></i>
          </div>
          <div>
            <span className="font-display font-bold text-lg text-chrome-effect uppercase block">Audi Motor</span>
            <span className="text-[var(--text-5)] text-xs">Admin Panel</span>
          </div>
        </Link>
      </div>

      <nav className="p-4 flex-1">
        <div className="mb-4">
          <p className="text-[var(--text-4)] text-xs font-medium uppercase tracking-wider px-3 mb-2">{t('admin.mainMenu')}</p>
        </div>
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive ? 'bg-[var(--surface-3)] text-[var(--text-1)] border-l-2 border-[var(--text-1)]' : 'text-[var(--text-4)] hover:text-[var(--text-1)] hover:bg-[var(--surface-2)]'}`}
                >
                  <i className={`fas ${item.icon} w-5 text-center text-xs`}></i>
                  <span>{t(item.labelKey)}</span>
                  {item.section && !canWrite(item.section) && (
                    <span className="ml-auto text-[10px] text-[var(--text-5)] bg-[var(--surface-3)] px-1.5 py-0.5 rounded">read</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-[var(--border-1)] space-y-2">
        {user && (
          <div className="px-3 py-2 bg-[var(--surface-2)] rounded-lg">
            <p className="text-[var(--text-1)] text-sm font-medium">{user.full_name || user.username}</p>
            <p className="text-[var(--text-5)] text-xs">{user.role}</p>
          </div>
        )}

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-4)] hover:text-[var(--text-1)] hover:bg-[var(--surface-2)] transition-all"
        >
          <i className="fas fa-external-link-alt w-5 text-center text-xs"></i>
          <span>{t('admin.viewSite')}</span>
        </Link>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all disabled:opacity-50"
        >
          <i className="fas fa-sign-out-alt w-5 text-center text-xs"></i>
          <span>{loggingOut ? t('admin.logout') + '...' : t('admin.logout')}</span>
        </button>
      </div>
    </aside>
  );
}
