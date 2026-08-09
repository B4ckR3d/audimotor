﻿﻿﻿﻿﻿'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { useLang } from '@/contexts/LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [brandName, setBrandName] = useState('Audi Motor');
  const [brandLogo, setBrandLogo] = useState('');
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    fetch('/api/public/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.brand_name) setBrandName(data.brand_name);
        if (data.brand_logo_url) setBrandLogo(data.brand_logo_url);
      })
      .catch(() => {});

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/cars', label: t('nav.cars') },
    { href: '/#koleksi', label: t('nav.collection') },
    { href: '/#tentang', label: t('nav.about') },
    { href: '/admin', label: t('nav.admin'), accent: true },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-md ` + (scrolled ? "bg-[var(--surface-2)]/95 shadow-lg" : "bg-[var(--surface-2)]/80") + " border-b border-[var(--border-1)]"}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* --- Left: Hamburger --- */}
            <div className="flex-1 flex justify-start">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--surface-3)] transition-all"
                aria-label="Open menu"
              >
                <i className="fas fa-bars text-xl" />
              </button>
            </div>

            {/* --- Center: Logo --- */}
            <Link
              href="/"
              className="flex-shrink-0 flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-full border-2 border-[var(--border-2)] flex items-center justify-center bg-gradient-to-br from-[var(--surface-3)] to-[var(--surface-2)] overflow-hidden shadow-[0_0_10px_rgba(150,150,150,0.15)] group-hover:shadow-[0_0_16px_rgba(150,150,150,0.25)] transition-shadow">
                {brandLogo ? (
                  <img
                    src={brandLogo}
                    alt={brandName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="fas fa-car-side text-[var(--text-3)] text-xl" />
                )}
              </div>
              <span className="font-display font-bold text-xl tracking-wider uppercase text-chrome-effect">
                {brandName}
              </span>
            </Link>

            {/* --- Right: Lang + Theme --- */}
            <div className="flex-1 flex justify-end items-center gap-1">
              <button
                type="button"
                onClick={toggleLang}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-xs font-bold tracking-wider text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--surface-3)] transition-all uppercase"
                aria-label="Toggle language"
              >
                {lang === 'id' ? 'EN' : 'ID'}
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--surface-3)] transition-all"
                aria-label="Toggle theme"
              >
                <i
                  className={theme === 'dark' ? 'fas fa-sun text-lg' : 'fas fa-moon text-lg'}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Left Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-[var(--surface-2)] border-r border-[var(--border-1)] shadow-2xl transform transition-all duration-300 ease-out ` + (mobileOpen ? "translate-x-0" : "-translate-x-full")}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-[var(--border-1)]">
          <span className="font-display font-semibold text-sm tracking-widest uppercase text-[var(--text-3)]">
            {t('nav.menu')}
          </span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--surface-3)] transition-all"
            aria-label="Close menu"
          >
            <i className="fas fa-times text-lg" />
          </button>
        </div>

        <div className="flex flex-col py-6 px-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={'px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-all hover:bg-[var(--surface-3)] ' + (link.accent ? 'text-[var(--accent)] hover:text-[var(--accent-hover)]' : 'text-[var(--text-2)] hover:text-[var(--text-1)]')}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}



