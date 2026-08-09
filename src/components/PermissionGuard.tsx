'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useLang } from '@/contexts/LanguageContext';

interface PermissionGuardProps {
  section: string;
  action?: 'read' | 'write';
  children: ReactNode;
  fallback?: ReactNode;
}

export default function PermissionGuard({
  section,
  action = 'write',
  children,
  fallback,
}: PermissionGuardProps) {
  const { t } = useLang();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if (cancelled) return;

        if (!res.ok || !data.success) {
          setRedirectToLogin(true);
          return;
        }

        const user = data.user;
        if (user.role === 'admin') {
          setAllowed(true);
          return;
        }

        const perms = user.permissions || {};
        const perm = perms[section] || 'none';

        if (action === 'read') {
          setAllowed(perm === 'read' || perm === 'write');
        } else {
          setAllowed(perm === 'write');
        }
      } catch {
        if (!cancelled) setRedirectToLogin(true);
      }
    };

    checkAuth();

    return () => { cancelled = true; };
  }, [section, action]);

  if (redirectToLogin) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[var(--text-5)] text-sm">{t('perm.redirecting')}</div>
      </div>
    );
  }

  if (allowed === null) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[var(--text-5)] text-sm">{t('perm.loading')}</div>
      </div>
    );
  }

  if (!allowed) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <i className="fas fa-lock text-4xl text-[var(--text-5)] mb-4"></i>
        <h2 className="text-xl font-bold text-[var(--text-1)] mb-2">{t('perm.denied')}</h2>
        <p className="text-[var(--text-4)] text-sm">{t('perm.noAccess')}</p>
      </div>
    );
  }

  return <>{children}</>;
}
